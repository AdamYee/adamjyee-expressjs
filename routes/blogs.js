var express = require('express');
var router = express.Router();

router.get('/blog/:handle', function (req, res) {
  res.render('blog/' + req.params.handle);
});

module.exports = router;