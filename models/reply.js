const mongoose = require('mongoose');

const replySchema = mongoose.Schema({
  threadId:         { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Thread' },
  created_on:       { type: Date, required: true },
  text:             { type: String, required: true },
  delete_password:  { type: String, required: true },
});

module.exports = mongoose.model('Reply', replySchema);