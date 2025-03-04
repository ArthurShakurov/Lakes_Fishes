const lakeToClient = (lake) => {
  return {
    id: lake.id,
    name: lake.name
  };
};

const lakesToClient = (lakes) => {
  return lakes.map(lakeToClient);
};

module.exports = {
  lakeToClient,
  lakesToClient
};
