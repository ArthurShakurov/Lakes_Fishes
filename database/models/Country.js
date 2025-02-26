const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cca2: {
        type: String,
        required: true
    }
});

const Country = mongoose.model('countries', countrySchema);

module.exports = Country;
