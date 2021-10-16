'use strict';

const mongoose = require('mongoose');

const Load = mongoose.model('Load', {
  name: {
    type: String,
    required: true,
  },
  payload: {
    type: Number,
    required: true,
  },
  pickup_address: {
    type: String,
    required: true,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  dimensions: {
    type: Object,
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
    default: 'NEW',
  },
  state: {
    type: String,
    default: null,
  },
  logs: [Object],
  created_date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = { Load };
