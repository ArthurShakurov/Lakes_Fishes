const fishToClient = (fish) => {
  return {
    id: fish.id,
    name: fish.name
  };
};

const fishesToClient = (fishes) => {
  return fishes.map(fishToClient);
};

module.exports = {
  fishToClient,
  fishesToClient
};
