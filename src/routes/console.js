/** Express HTTP Router **/
var express = require('express');
var router = express.Router();

function isAuth(req, res, next) {
  if(req.session.user) return next();
  else res.redirect('/console/login');
}

/** Home page. **/
router.get('/', isAuth, function(req, res, next) {
  res.render('console/dash', {
    blog:req.app.config
  })
});

router.get('/new', isAuth, function(req, res, next) {
  res.render('console/edit', {
    blog:req.app.config
  })
});

/** Login page and post **/
router.route('/login')
  .get(function(req, res, next) {
    res.render('console/login', {
      blog:req.app.config
    });
  })
  .post(function(req, res, next) {
    if(req.app.config.username == req.body.username && req.app.config.password == req.body.password) {
      req.session.user = req.body;
      res.redirect('/console');
    }
    else {
      res.redirect('/console/login')
    }
  })


// Expose the Express HTTP `index` router to main app.
module.exports = router;
