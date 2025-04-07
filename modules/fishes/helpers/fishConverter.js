const { lakesToClient } = require('../../lakes/helpers/lakeConverter');

const fishToClient = (fish) => {
  return {
    id: fish.id,
    name: fish.name,
    lakes: lakesToClient(fish.lakes),
    color: fish.color,
    birthday: fish.timeOfCreation
  };
};

const fishesToClient = (fishes) => {
  return fishes.map(fishToClient);
};

module.exports = {
  fishToClient,
  fishesToClient
};
