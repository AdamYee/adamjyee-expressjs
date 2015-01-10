var mongoose = require('mongoose');

var Schema = mongoose.Schema; //Schema.ObjectId
var MessageSchema = new Schema({
    message: { type: String, required: true }
});
module.exports = mongoose.model('Message', MessageSchema);
