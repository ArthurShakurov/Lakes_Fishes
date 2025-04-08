const {
  countryToClient
} = require('../../locations/helpers/locationConverter');

const fieldToClient = (field) => {
  return {
    id: field.id,
    name: field.name,
    country: field.country && countryToClient(field.country)
  };
};

const fieldsToClient = (fields) => {
  return fields.map(fieldToClient);
};

const fieldToClientFull = (field) => {
  return {
    id: field.id,
    name: field.name,
    country: field.country && countryToClient(field.country),
    size: field.size
  };
};

module.exports = {
  fieldToClient,
  fieldsToClient,
  fieldToClientFull
};
