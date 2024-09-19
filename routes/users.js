var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
   res.send("<h1> Hello, World! </h1>");
});

module.exports = router;
