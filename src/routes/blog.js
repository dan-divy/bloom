/** Express HTTP Router **/
var express = require('express');
var path = require('path');
var markdownParser = require('marked');
var fs = require('fs');
var ta = require('time-ago');
var router = express.Router();
var database = require('../../_data/catalog');

/** Home page. **/
router.get('/:post', function(req, res, next) {
  var file_name = req.params.post;
  if(database[req.params.post]) {
    var md = fs.readFileSync(path.join(__dirname,`../../_dist/posts/${database[req.params.post].file}`), 'utf-8');
    var html = markdownParser(md,{gfm:true})
    res.render('blog', {
      blog:req.app.config,
      content:html,
      time:ta.ago(database[req.params.post].date),
      title:database[req.params.post].title
    });
  }

});

// Expose the Express HTTP `index` router to main app.
module.exports = router;
