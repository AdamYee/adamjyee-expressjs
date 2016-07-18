'use strict';
const express = require('express');
const router = express.Router();
const jade = require('jade');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

router.get('/blog', (req, res) => {
  glob("**/views/blog/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]_*jade", {}, function (er, articles) {
    const regex = /\d{4}-\d{2}-\d{2}_?[\w\d-]*/;
    articles = articles.map(a => {
      const path = a.match(regex)[0];
      const articleName = path.split('_')[1].replace(/\-/g, ' ');
      console.log(articleName);
      return {
        date: path.split('_')[0],
        path,
        articleName
      };
    })
    .sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
    res.render('blog-list', {articles});
  });
});

router.get('/blog/article/:article', (req, res) => {
  res.send(jade.renderFile(`views/blog/${req.params.article}.jade`));
});

router.get('/blog/:article', (req, res) => {
  const p = `${path.resolve()}/views/blog/${req.params.article}.jade`;
  fs.stat(p, function (err, stats) {
    if(err) {
      res.render('blog/404-article');
    } else {
      res.render('blog/article');
    }
  });
});

module.exports = router;