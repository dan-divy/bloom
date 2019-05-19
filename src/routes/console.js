/** Express HTTP Router **/
var express = require('express');
var router = express.Router();
var database = require('../../_data/catalog');
var path = require('path');
var fs = require('fs');

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

router.post('/new', isAuth, function(req, res, next) {
  var blog_title = req.body.title;
  var blog_content = req.body.content;
  var blog_caption = req.body.caption;
  blog_title = blog_title.replace(/\s+/g, '-').toLowerCase();
  database[blog_title] = {
    suffix: blog_title,
    title:req.body.title,
    date:Date.now(),
    file:blog_title+".md",
    author:req.app.config.author,
    caption:blog_caption
  }
  console.log(database)
  fs.writeFileSync(path.join(__dirname,'../../_data/catalog.json'), JSON.stringify(database, null, 2));
  fs.writeFileSync(path.join(__dirname,'../../_dist/posts/'+blog_title+'.md'), blog_content);
  res.redirect('/console?task=done');
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
