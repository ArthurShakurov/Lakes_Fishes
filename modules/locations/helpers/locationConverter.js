const countryToClient = (country) => {
  return {
    id: country._id,
    name: country.name
  };
};

const countriesToClient = (countries) => {
  // console.log(countries);
  return countries.map(countryToClient);
};

module.exports = {
  countryToClient,
  countriesToClient
};
