const countryToClient = (country) => {
  return {
    id: country._id,
    name: country.name
  };
};

const countriesToClient = (countries) => {
  return countries.map(countryToClient);
};

module.exports = {
  countryToClient,
  countriesToClient
};
