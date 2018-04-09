var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var title = req.session.cookie.expires
  res.render('index', { title: title });
});

router.get('/fndr', function(req, res, next) {
  res.render('fndr')
})

module.exports = router;
