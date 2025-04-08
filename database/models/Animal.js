const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fields: [
    {
      type: Schema.Types.ObjectId,
      ref: 'fields',
      required: true
    }
  ],
  type: {
    type: String,
    required: true
  },
  timeOfCreation: {
    type: Date,
    required: true
  }
});

const Animal = mongoose.model('animal', animalSchema);

module.exports = Animal;
