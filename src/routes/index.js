/** Express HTTP Router **/
var express = require('express');
var path = require('path');
var markdownParser = require('marked');
var o = require('object-tools');
var fs = require('fs')
var router = express.Router();
var database = require('../../_data/catalog.json');

/** Home page. **/
router.get('/', async function(req, res, next) {
  var dataArray = new Array();
  await o.each(database, n => {
    dataArray.push(n)
  });
  res.render('index', {
    blog:req.app.config,
    posts:dataArray
  });
});

// Expose the Express HTTP `index` router to main app.
module.exports = router;
