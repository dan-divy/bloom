/** Express HTTP Router **/
var express = require('express');
var path = require('path');
var markdownParser = require('marked');
var fs = require('fs')
var router = express.Router();

/** Home page. **/
router.get('/:post', function(req, res, next) {
  var file_name = req.params.post;
  var md = fs.readFileSync(path.join(__dirname,'../../_dist/'+file_name+'.md'), 'utf-8');
  var html = markdownParser(md,{gfm:true})
  res.render('blog', {
    blog:req.app.config,
    content:html
  });
});

// Expose the Express HTTP `index` router to main app.
module.exports = router;
