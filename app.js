var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('intellect:server');
var http = require('http');
var sassMiddleware = require('node-sass-middleware');

var app = express();
app.config = require('./_data/config');

var indexRouter = require('./src/routes/index');
var adminRouter = require('./src/routes/console');
var blogRouter = require('./src/routes/blog');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var cooky = {
	secret: 'work hard',
  	resave: true,
  	expires: new Date() * 60 * 60 * 24 * 30,
  	saveUninitialized: true
}

app.set('trust proxy', 1) // trust first proxy
app.use(session(cooky))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, '_files/scss'),
    dest: path.join(__dirname, '_files/css'),
    outputStyle: 'compressed',
    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="css/style.css"/>
}));
app.use(express.static(path.join(__dirname, '_files')));

/**
 * An express middleware to check if `user` has authenticated.
 *
 * @param {Object|Array} req
 * @param {Object|Array} res
 * @param {Function} next
 * @api private
 */
function isLoggedIn(req, res, next) {
  if (req.session.user) return next();
  if(!req.url.startsWith('/authorize')) return res.redirect('/authorize');
  next();
}
// route middleware to make sure a user is logged in

app.use('/', indexRouter);
app.use('/console', adminRouter);
app.use('/feed', blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || app.config.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on '+ bind)
}
