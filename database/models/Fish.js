const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const fishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true, dropDups: true }
  },
  lakes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'lakes',
      required: true
    }
  ],
  color: {
    type: String,
    required: true
  },
  timeOfCreation: {
    type: Date,
    required: true
  }
});

const Fish = mongoose.model('fish', fishSchema);

module.exports = Fish;
