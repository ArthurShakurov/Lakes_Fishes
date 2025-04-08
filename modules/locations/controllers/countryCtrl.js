const express = require('express');
require('express-async-errors');
const axios = require('axios');
const _ = require('lodash');
const Country = require('../../../database/models/Country');
const {
  countryToClient,
  countriesToClient,
  countryToClientFull
} = require('../helpers/locationConverter');
const { default: mongoose } = require('mongoose');
const { param, body, validationResult } = require('express-validator');

const getAllCountries = async (req, res) => {
  // поиск и запись все стран
  const countries = await Country.find();

  res.status(200).json({
    status: 'success',
    results: countries.length,
    countries: countriesToClient(countries)
  });
};

const getOneCountry = [
  param('countryId').isMongoId().withMessage('country ID should be Mongo'),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }
    // запись Id в переменную
    const { countryId } = req.params;

    // поиск страны в БД
    const country = await Country.findOne({ _id: countryId });

    res.status(200).json({
      status: 'success',
      country: countryToClientFull(country)
    });
  }
];

const importCountries = async (req, res) => {
  // запрос по ссылке и запись всех стран
  console.log(1234);
  const allImportedCountries = await axios
    .get('https://restcountries.com/v3.1/all')
  ;

  console.log(123);
  // поиск всех стран в БД
  const inBaseCountries = await Country.find();

  let foundCountries = 0;
  let newCountries = 0;
  const countriesToAdd = [];

  // сравнение стран по ссылке со странами в БД
  allImportedCountries.data.forEach((element) => {
    // поиск
    const countryInLoop = _.find(inBaseCountries, (u) => {
      return (
        u.name === element.translations.rus.common || u.cca2 === element.cca2
      );
    });
    if (countryInLoop) {
      foundCountries++;
    } else {
      // если страны нет, создать...
      const newCountry = new Country({
        cca2: element.cca2,
        name: element.translations.rus.common
      });
      newCountries++;
      // ...и записать в переменную с последующей записью в БД
      countriesToAdd.push(newCountry.save());
    }
  });

  // записать новые страны в БД
  await Promise.all(countriesToAdd);
  return res.status(200).json({
    inBase: foundCountries,
    newCountries: newCountries
  });
};

const createCountry = async (req, res) => {
  // найти предложенную страну в БД
  const existingCountry = await Country.findOne({
    $or: [{ name: req.body.name }, { cca2: req.body.cca2 }]
  });

  // если страна есть, ошибка
  if (existingCountry) {
    return res.status(400).json({
      status: 'fail',
      message: 'Country with this name or cca2 already exists!'
    });
  }

  // создание страны в БД
  const { name, cca2 } = req.body;
  const country = await Country.create({
    name,
    cca2
  });

  res.status(201).json({
    status: 'success',
    data: {
      country: countryToClient(country)
    }
  });
};

const editOneCountry = [
  param('countryId').isMongoId(),
  body('name').notEmpty().isLength({ min: 2 }),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }
    // сохранение параметров из тела запроса
    const { name, cca2, muslim } = req.body;

    // сохранение ID из ссылки запроса
    const { countryId } = req.params;

    // поиске страны в БД
    const country = await Country.findOne({ _id: countryId });
    if (!country) {
      throw new Error(`No country with id:${countryId}`);
    }

    // console.log(req.body);
    //ссылка на ф-цию перезаписи пунктов
    convertCountryToDb(req.body, country);

    // запись
    await country.save();

    res.json({
      success: true,
      country: countryToClient(country)
    });
  }
];

const convertCountryToDb = (req, country) => {
  if (req.name !== undefined) country.name = req.name;
  if (req.cca2 !== undefined) country.cca2 = req.cca2;
  if (req.muslim !== undefined) country.muslim = !!parseInt(req.muslim);
};

module.exports = {
  getAllCountries,
  importCountries,
  createCountry,
  getOneCountry,
  editOneCountry
};
