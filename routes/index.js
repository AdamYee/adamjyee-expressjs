var express = require('express');
var router = express.Router();
var jade = require('jade');

router.get('/', (req, res) => {
  render(res, 'index', {index: true});
});

router.get('/about', (req, res) => {
  renderJade(res, 'views/home/about.jade');
});

router.get('/code', (req, res) => {
  renderJade(res, 'views/home/code.jade');
});

router.get('/resume', (req, res) => {
  renderJade(res, 'views/home/resume.jade');
});

router.get('/code/play-minesweeper', (req, res) => {
  render(res, 'code/minesweeper');
});

router.get('/code/canvas', (req, res) => {
  render(res, 'code/canvas');
});

router.get('/code/yelp', (req, res) => {
  render(res, 'code/yelp');
});

router.get('/code/messages-durandal', (req, res) => {
  render(res, 'code/messages-durandal');
});

router.get('/code/messages-backbone', (req, res) => {
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
