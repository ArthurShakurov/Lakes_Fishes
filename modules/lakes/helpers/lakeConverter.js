const {
  countryToClient
} = require('../../locations/helpers/locationConverter');

const lakeToClient = (lake) => {
  return {
    id: lake.id,
    name: lake.name,
    country: lake.country && countryToClient(lake.country),
    saulted: lake.saulted
  };
};

const lakesToClient = (lakes) => {
  return lakes.map(lakeToClient);
};

module.exports = {
  lakeToClient,
  lakesToClient
};
