var express = require('express');
var router = express.Router();

// views/index.jade
router.get('/', function (req, res) {
	res.render('index', {title: 'Home'});
});

// views/methods.jade
router.get('/methods', function (req, res) {
	res.render('methods', {title: 'Methods'});
});

// views/about.jade
router.get('/about', function (req, res) {
	res.render('about', {title: 'About'});
});

module.exports = router;
