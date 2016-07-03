var express = require('express');
var router = express.Router();
var jade = require('jade');

/* GET home page. */
router.get('/', function (req, res) {
  render(res, 'index', {index: true});
});

router.get('/blog', function (req, res) {
  render(res, 'blog-list');
});

router.get('/about', function (req, res) {
  renderJade(res, 'views/home/about.jade');
});

router.get('/code', function (req, res) {
  renderJade(res, 'views/home/code.jade');
});

router.get('/resume', function (req, res) {
  renderJade(res, 'views/home/resume.jade');
});

router.get('/code/play-minesweeper', function (req, res) {
  render(res, 'code/minesweeper');
});

router.get('/code/canvas', function (req, res) {
  render(res, 'code/canvas');
});

router.get('/code/yelp', function (req, res) {
  render(res, 'code/yelp');
});

router.get('/code/messages-durandal', function (req, res) {
  render(res, 'code/messages-durandal');
});

router.get('/code/messages-backbone', function (req, res) {
  render(res, 'code/messages-backbone');
});

module.exports = router;

function render(res, view, locals, cb) {
  locals = locals || {};
  locals.env = process.env.NODE_ENV
  res.render(view, locals, cb);
}

function renderJade(res, file) {
  res.send(jade.renderFile(file));
}
