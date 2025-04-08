const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true, dropDups: true }
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'countries'
  },
  size: {
    type: Number,
    required: true
  }
});

const Field = mongoose.model('fields', fieldSchema);

module.exports = Field;
