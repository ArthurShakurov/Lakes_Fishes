const { lakesToClient } = require('../../lakes/helpers/lakeConverter');

const fishToClient = (fish) => {
  return {
    id: fish.id,
    name: fish.name,
    lakes: lakesToClient(fish.lakes)
  };
};

const fishesToClient = (fishes) => {
  return fishes.map(fishToClient);
};

const fishToClientFull = (fish) => {
  return {
    id: fish.id,
    name: fish.name,
    lakes: lakesToClient(fish.lakes),
    color: fish.color,
    birthday: fish.timeOfCreation
  };
};

module.exports = {
  fishToClient,
  fishesToClient,
  fishToClientFull
};
