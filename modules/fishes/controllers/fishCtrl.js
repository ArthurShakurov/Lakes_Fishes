const express = require('express');
require('express-async-errors');
const _ = require('lodash');
const mongoose = require('mongoose');
const Fish = require('../../../database/models/Fish');
const Lake = require('../../../database/models/Lake');
const { fishToClient, fishesToClient } = require('../helpers/fishConverter');
const Country = require('../../../database/models/Country');
const { body, validationResult, param } = require('express-validator');

const getAllFishes = async (req, res) => {
  const query = {};
  const { name, lakeId } = req.body;
  if (name) {
    query.name = { $regex: req.body.name, $options: 'i' };
  }

  if (lakeId) {
    query.lakes = req.body.lakeId;
  }

  // поиск всех рыб в БД
  const fishes = await Fish.find(query)
    .populate('lakes')
    .populate({
      path: 'lakes',
      populate: {
        path: 'country'
      }
    });

  res.json({
    success: true,
    results: fishes.length,
    data: fishesToClient(fishes)
  });
};

const getOneFish = [
  param('fishId').isMongoId().withMessage('id should be MongoID'),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }
    // сохранение ID рыбы из ссылки запроса
    const { fishId } = req.params;

    // поиск рыбы в БД
    const fish = await Fish.findOne({ _id: fishId })
      .populate('lakes', 'name country')
      .populate({
        path: 'lakes',
        populate: {
          path: 'country'
        }
      });

    res.json({
      success: true,
      data: fishToClient(fish)
    });
  }
];

const makeOneFish = [
  body('name').notEmpty().isLength({ min: 2 }).isString(),
  async (req, res) => {
    // запись переменных из тела запроса
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }

    const { name, lake, color } = req.body;

    // проверка озера для рыбы
    const foundlakes = await Lake.findOne({ _id: { $in: lake } });

    if (!foundlakes) {
      console.log(lake);
      throw new Error(`No lake with id: ${lake}`);
    }

    // запись новой рыбы в переменную
    const fish = new Fish({
      name,
      lakes: lake,
      color: color,
      timeOfCreation: Date.now()
    });

    // ...и сохранение в БД
    await fish.save();

    res.json({
      success: true,
      fish: fishToClient(fish)
    });
  }
];

const editOneFish = [
  param('fishId').isMongoId().withMessage('...fishes/fishId should be MongoID'),
  body('lakeIds')
    .isArray({ min: 1 })
    .withMessage('lakeId should be an array with at least 1 element'),
  body('lakeIds[*]')
    .isMongoId()
    .withMessage('each element of lakeId should be MongoID'),
  body('name').isLength({ min: 2 }).isString(),
  async (req, res) => {
    // отправка ошибок пользователю
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }

    // запись переменных из ссылки запроса
    const { fishId } = req.params;

    // запись переменных из тела запроса
    const { lakeIds } = req.body;

    // проверка наличия рыбы в БД
    const fish = await Fish.findOne({ _id: fishId });
    if (!fish) {
      throw new Error(`No fish with id:${fishId}`);
    }

    // проверка озера для рыбы
    const foundlakes = await Lake.findOne({ _id: { $in: lakeIds } });
    if (!foundlakes) {
      // console.log(lakeId);
      throw new Error(`No lake with id: ${lakeIds}`);
    }

    // console.log('req.body:', req.body);
    // ссылка на ф-цию перезаписи
    convertFishToDb(req.body, fish);

    // ...и сохранение в БД
    await fish.save();

    res.json({
      success: true
    });
  }
];

const convertFishToDb = (req, fish) => {
  fish.name = req.name;
  fish.lakes = req.lakeIds.map((d) => new mongoose.Types.ObjectId(d));
  fish.color = req.color;
};

module.exports = {
  getAllFishes,
  getOneFish,
  makeOneFish,
  editOneFish
};
