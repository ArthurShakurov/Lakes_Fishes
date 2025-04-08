const countryToClient = (country) => {
  return {
    id: country._id,
    name: country.name
  };
};

const countriesToClient = (countries) => {
  return countries.map(countryToClient);
};

const countryToClientFull = (country) => {
  return {
    id: country._id,
    name: country.name,
    muslim: country.muslim,
    cca2: country.cca2
  };
};

module.exports = {
  countryToClient,
  countriesToClient,
  countryToClientFull
};
