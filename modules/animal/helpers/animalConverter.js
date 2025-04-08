const { fieldsToClient } = require('../../fields/helpers/fieldConverter');

const animalToClient = (animal) => {
  return {
    id: animal.id,
    type: animal.type,
    fields: fieldsToClient(animal.fields)
  };
};

const animalsToClient = (animals) => {
  return animals.map(animalToClient);
};

const animalToClientFull = (animal) => {
  return {
    id: animal.id,
    name: animal.name,
    fields: fieldsToClient(animal.fields),
    type: animal.type,
    birthday: animal.timeOfCreation
  };
};

module.exports = {
  animalToClient,
  animalsToClient,
  animalToClientFull
};
