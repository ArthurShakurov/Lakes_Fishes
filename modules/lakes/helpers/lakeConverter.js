const {
  countryToClient
} = require('../../locations/helpers/locationConverter');

const lakeToClient = (lake) => {
  return {
    id: lake.id,
    name: lake.name,
    country: lake.country && countryToClient(lake.country)
  };
};

const lakesToClient = (lakes) => {
  return lakes.map(lakeToClient);
};

const lakeToClientFull = (lake) => {
  return {
    id: lake.id,
    name: lake.name,
    country: lake.country && countryToClient(lake.country),
    saulted: lake.saulted
  };
};

module.exports = {
  lakeToClient,
  lakesToClient,
  lakeToClientFull
};
