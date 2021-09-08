'use strict';

const mongoose = require('mongoose');

const Truck = mongoose.model('Truck', {
  type: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  status: {
    type: String,
    default: 'IS',
  },
  payload: {
    type: Number,
  },
  dimensions: Object,
  created_date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = { Truck };
