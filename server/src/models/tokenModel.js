const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const Token = mongoose.model('Token', {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

module.exports = { Token };
