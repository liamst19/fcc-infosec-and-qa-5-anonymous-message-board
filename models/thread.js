const mongoose = require('mongoose');

const threadSchema = mongoose.Schema({
  text:             { type: String, required: true },
  created_on:       { type: Date, required: true },
  bumped_on:        { type: Date, required: true },
  delete_password:  { type: String, required: true },
  replies:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]  
});

module.exports = mongoose.model('Thread', threadSchema);