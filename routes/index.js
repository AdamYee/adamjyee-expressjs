var express = require('express');
var router = express.Router();
var jade = require('jade');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {index: true});
});
router.get('/about', function (req, res) {
  res.send(jade.renderFile('views/home/about.jade'));
});
router.get('/code', function (req, res) {
  res.send(jade.renderFile('views/home/code.jade'));
});
router.get('/resume', function (req, res) {
  res.send(jade.renderFile('views/home/resume.jade'));
});

router.get('/code/play-minesweeper', function (req, res) {
  res.render('code/minesweeper');
});
router.get('/code/canvas', function (req, res) {
  res.render('code/canvas');
});
router.get('/code/yelp', function (req, res) {
  res.render('code/yelp');
});
router.get('/code/messages-durandal', function (req, res) {
  res.render('code/messages-durandal');
});
router.get('/code/messages-backbone', function (req, res) {
  res.render('code/messages-backbone');
});

module.exports = router;
