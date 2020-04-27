const mongoose = require('mongoose');

const replySchema = mongoose.Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true }
});


module.exports = mongoose.model('Reply', replySchema);