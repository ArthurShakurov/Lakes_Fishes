const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
const _ = require('lodash');
const Lake = require('../../../database/models/Lake');
const Country = require('../../../database/models/Country');
const { lakeToClient, lakesToClient } = require('../helpers/lakeConverter');
const { body, validationResult, param } = require('express-validator');
const { options } = require('../routes');

const getAllLakes = async (req, res) => {
  const query = {};
  const { name, lakeId } = req.body;
  if (name) {
    query.name = { $regex: req.body.name, $options: 'i' };
  }

  if (lakeId) {
    query.lakes = req.body.lakeId;
  }

  // поиск всех озёр в БД
  const lakes = await Lake.find(query).populate('country');

  res.json({
    success: true,
    results: lakes.length,
    lakes: lakesToClient(lakes)
  });
};

const getOneLake = [
  param('lakeId').isMongoId().withMessage('Id should be MongoId'),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }
    // сохранение ID озера из ссылки запроса
    const { lakeId } = req.params;

    // поиск озера в БД
    const lake = await Lake.findOne({ _id: lakeId }).populate('country');

    res.json({
      success: true,
      lake: lakeToClient(lake)
    });
  }
];

const makeOneLake = [
  body('name').notEmpty().isLength({ min: 2 }),
  async (req, res) => {
    const result = validationResult;
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }
    // сохранение параметров из тела запроса
    const { name, countryId, saulted } = req.body;

    // проверка страны на наличие в БД
    const country = await Country.findOne({ _id: countryId });
    if (!country) {
      throw new Error(`No country with id: ${countryId}`);
    }

    // создание озера
    const lake = new Lake({
      name,
      countries: country,
      saulted: saulted
    });

    // запись озера в БД
    await lake.save();

    res.json({
      success: true,
      lake: lakeToClient(lake)
    });
  }
];

const editOneLake = [
  param('lakeId').isMongoId().withMessage('...lakes/lakeId should be MongoID'),
  body('name').isLength({ min: 2 }).isString(),
  async (req, res) => {
    const result = validationResult;
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }
    // сохранение параметров из тела запроса
    const { name, countryId, saulted } = req.body;

    // сохранение ID из ссылки запроса
    const { lakeId } = req.params;

    // поиск озера на наличие в БД
    const lake = await Lake.findOne({ _id: lakeId });
    if (!lake) {
      throw new Error(`No lake with id: ${lakeId}`);
    }

    // проверка страны на наличие в БД
    if (countryId) {
      const country = await Country.findOne({ _id: countryId });
      if (!country) {
        throw new Error(`No country with id: ${countryId}`);
      }
    }

    // ссылка на ф-цию перезаписи пункта в БД
    convertLakeToDb(req.body, lake);
    // console.log(req.body);

    // запись озера в БД
    await lake.save();

    res.json({
      success: true,
      lake: lakeToClient(lake)
    });
  }
];

// ф-ция перезаписи пункта в БД
const convertLakeToDb = (req, lake) => {
  if (req.name !== undefined) lake.name = req.name;
  if (req.country !== undefined)
    lake.country = new mongoose.Types.ObjectId(req.countryId);
  if (req.saulted !== undefined) lake.saulted = Boolean(parseInt(req.saulted));
};

module.exports = {
  getAllLakes,
  getOneLake,
  makeOneLake,
  editOneLake
};
