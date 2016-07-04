var express = require('express');
var router = express.Router();
var jade = require('jade');

router.get('/blog/article/:article', (req, res) => {
  res.send(jade.renderFile(`views/blog/${req.params.article}.jade`));
});

router.get('/blog/*', (req, res) => {
  res.render('blog/blog-article');
});

module.exports = router;