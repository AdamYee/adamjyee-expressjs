var express = require('express');
var router = express.Router();
var MessageModel = require('../models/message');

// Create
router.post('/', function (req, res) {
  var message;
  console.log("POST: ");
  console.log(req.body);
  message = new MessageModel({
    message: req.body.message
  });
  message.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.json(message);
});

// Read
router.get('/', function (req, res) {
  return MessageModel.find(function (err, messages) {
    if(!err) {
      return res.json(messages);
    } else {
      throw err;
    }
  });
  // stub data
  // res.json([{"id": 57, "message": "r23r23r23"}, {"id": 54, "message": "wefoijweof aowiejfwef"}]);
});

// Update
router.put('/:id', function (req, res) {
  return MessageModel.findById(req.params.id, function (err, message) {
    message.message = req.body.message;
    return message.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.json(message);
    });
  });
});

// Delete
router.delete('/:id', function (req, res) {
  return MessageModel.findById(req.params.id, function (err, message) {
    return message.remove(function (err) {
      if (!err) {
        return res.json('');
      } else {
        console.log(err);
      }
    });
  });
});

module.exports = router;
