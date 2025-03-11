const express = require('express');
require('express-async-errors');
const _ = require('lodash');
const Lake = require('../../../database/models/Lake');
const Country = require('../../../database/models/Country');
const { lakeToClient, lakesToClient } = require('../helpers/lakeConverter');

const getAllLakes = async (req, res) => {
  // поиск всех стран в БД 👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹
  const lakes = await Lake.find().populate('country');

  res.json({
    success: true,
    results: lakes.length,
    lakes: lakesToClient(lakes)
  });
};

const getOneLake = async (req, res) => {
  // сохранение ID озера из ссылки запроса
  const { lakeId } = req.params;

  // поиск озера в БД 👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹👻👹
  const lake = await Lake.findOne({ _id: lakeId }).populate('country');

  res.json({
    success: true,
    lake: lakeToClient(lake)
  });
};

const makeOneLake = async (req, res) => {
  // сохранение параметров из тела запроса
  const { name, countryId } = req.body;

  // проверка страны на наличие в БД
  const country = await Country.findOne({ _id: countryId });
  if (!country) {
    throw new Error(`No country with id: ${countryId}`);
  }

  // создание озера
  const lake = new Lake({
    name,
    country: countryId,
    timeOfCreation: Date.now()
  });

  // запись озера в БД
  await lake.save();

  res.json({
    success: true,
    newLakeId: lake._id
  });
};

module.exports = {
  getAllLakes,
  getOneLake,
  makeOneLake
};
