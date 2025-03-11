const express = require('express');
require('express-async-errors');
const axios = require('axios');
const _ = require('lodash');
const Country = require('../../../database/models/Country');
const {
  countryToClient,
  countriesToClient
} = require('../helpers/locationConverter');

const getAllCountries = async (req, res) => {
  // поиск и запись все стран
  const countries = await Country.find();

  res.status(200).json({
    status: 'success',
    results: countries.length,
    countries: countriesToClient(countries)
  });
};

const importCountries = async (req, res) => {
  // запрос по ссылке и запись всех стран
  const allImportedCountries = await axios.get(
    'https://restcountries.com/v3.1/all'
  );

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
      country
    }
  });
};

module.exports = {
  getAllCountries,
  importCountries,
  createCountry
};
