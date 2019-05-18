/** Express HTTP Router **/
var express = require('express');
var router = express.Router();

/** Home page. **/
router.get('/', function(req, res, next) {
  res.render('admin', req.app.config);
});

// Expose the Express HTTP `index` router to main app.
module.exports = router;
