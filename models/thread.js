const mongoose = require('mongoose');

const threadSchema = mongoose.Schema({
  title:            { type: String, require: true },
  board:            { type: String, required: true },
  text:             { type: String, required: true },
  created_on:       { type: Date, required: true },
  bumped_on:        { type: Date, required: true },
  delete_password:  { type: String, required: true },
  reported:         { type: Boolean, default: false },
  replies:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
});

threadSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Thread', threadSchema);