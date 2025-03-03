const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const lakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true, dropDups: true }
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'countries'
  }
});

const Lake = mongoose.model('lakes', lakeSchema);

module.exports = Lake;
