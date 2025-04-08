const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
const _ = require('lodash');
const Animal = require('../../../database/models/Animal');
const Country = require('../../../database/models/Country');
const Field = require('../../../database/models/Field');
const {
  animalToClient,
  animalsToClient,
  animalToClientFull
} = require('../helpers/animalConverter');
const { body, validationResult, param } = require('express-validator');

const animalValidation = [
  body('name').notEmpty().isLength({ min: 2 }),
  body('type').notEmpty().isLength({ min: 2 }),
  body('fieldIds')
    .isArray({ min: 1 })
    .withMessage('fieldIds should be an array with at least 1 element'),
  body('fieldIds[*]')
    .isMongoId()
    .withMessage('each element of fieldId should be MongoID')
];

const convertAnimalToDb = (req, animal) => {
  animal.name = req.name;
  animal.type = req.type;
  animal.fields = req.fieldIds.map((id) => new mongoose.Types.ObjectId(id));
};

const getAllAnimal = async (req, res) => {
  const query = {};
  const { name, fieldId } = req.body;
  if (name) {
    query.name = { $regex: req.body.name, $options: 'i' };
  }

  if (fieldId) {
    query.fields = req.body.fieldId;
  }

  const animals = await Animal.find(query)
    .populate('fields')
    .populate({
      path: 'fields',
      populate: {
        path: 'country'
      }
    });

  res.json({
    success: true,
    results: animals.length,
    data: animalsToClient(animals)
  });
};

const getOneAnimal = [
  param('animalId').isMongoId().withMessage('id should be MongoID'),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }

    const { animalId } = req.params;

    const animal = await Animal.findOne({ _id: animalId })
      .populate('fields', 'name country')
      .populate({
        path: 'fields',
        populate: {
          path: 'country'
        }
      });

    res.json({
      success: true,
      data: animalToClient(animal)
    });
  }
];

const makeOneAnimal = [
  ...animalValidation,
  async (req, res) => {
    // запись переменных из тела запроса
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }

    const { name, fieldIds, type } = req.body;

    const foundFields = await Field.find({ _id: { $in: fieldIds } });
    // console.log(fieldIds);
    // console.log(foundFields);
    if (foundFields.length !== fieldIds.length) {
      console.log('fields', fieldIds);
      throw new Error(`No field with id: ${fieldIds}`);
    }

    const animal = new Animal({
      name,
      fields: foundFields,
      type,
      timeOfCreation: Date.now()
    });

    // ...и сохранение в БД
    await animal.save();

    res.json({
      success: true,
      animal: animalToClientFull(animal)
    });
  }
];

const editOneAnimal = [
  param('animalId').isMongoId().withMessage('... should be MongoID'),
  ...animalValidation,
  async (req, res) => {
    // отправка ошибок пользователю
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }

    // запись переменных из ссылки запроса
    const { animalId } = req.params;

    // запись переменных из тела запроса
    const { fieldIds } = req.body;

    // проверка наличия рыбы в БД
    const animal = await Animal.findOne({ _id: animalId });
    if (!animal) {
      throw new Error(`No animal with id:${animalId}`);
    }

    // проверка озера для рыбы
    const foundFields = await Field.find({ _id: { $in: fieldIds } });
    if (!foundFields) {
      throw new Error(`No field with id: ${fieldIds}`);
    }

    // ссылка на ф-цию перезаписи
    convertAnimalToDb(req.body, animal);

    // ...и сохранение в БД
    await animal.save();

    res.json({
      success: true,
      animal: animalToClientFull(animal)
    });
  }
];

const deleteOneAnimal = [
  param('animalId').isMongoId().withMessage('... should be MongoID'),
  async (req, res) => {
    const { animalId } = req.params;

    const animal = await Animal.findOne({ _id: { $in: animalId } });
    if (!animal) {
      throw new Error(`No animal with id: ${animalId}`);
    }

    await Animal.findByIdAndDelete(animalId);

    res.json({
      success: true,
      message: 'Animal have been deleted'
    });
  }
];

module.exports = {
  getAllAnimal,
  getOneAnimal,
  makeOneAnimal,
  editOneAnimal,
  deleteOneAnimal
};
