var express = require('express');
var router = express.Router();
var jade = require('jade');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});
router.get('/about', function (req, res) {
  res.send(jade.renderFile('views/about.jade'));
});
router.get('/code', function (req, res) {
  res.send(jade.renderFile('views/code.jade'));
});
router.get('/resume', function (req, res) {
  res.send(jade.renderFile('views/resume.jade'));
});

router.get('/code/minesweeper', function (req, res) {
  res.render('minesweeper');
});
router.get('/code/canvas', function (req, res) {
  res.render('canvas');
});
router.get('/code/yelp', function (req, res) {
  res.render('yelp');
});
router.get('/code/messages-durandal', function (req, res) {
  res.render('messages-durandal');
});
router.get('/code/messages-backbone', function (req, res) {
  res.render('messages-backbone');
});

module.exports = router;
