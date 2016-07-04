'use strict';
const express = require('express');
const router = express.Router();
const jade = require('jade');
const fs = require('fs');
const path = require('path');

router.get('/blog/article/:article', (req, res) => {
  res.send(jade.renderFile(`views/blog/${req.params.article}.jade`));
});

router.get('/blog/:article', (req, res) => {
  const p = `${path.resolve()}/views/blog/${req.params.article}.jade`;
  fs.stat(p, function (err, stats) {
    if(err) {
      res.render('blog/404-article');
    } else {
      res.render('blog/blog-article');
    }
  });
});

module.exports = router;