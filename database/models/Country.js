const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true, dropDups: true }
  },
  cca2: {
    type: String,
    required: true,
    index: { unique: true, dropDups: true }
  },
  muslim: {
    type: Boolean,
    required: true,
    default: false
  }
});

const Country = mongoose.model('countries', countrySchema);

module.exports = Country;
