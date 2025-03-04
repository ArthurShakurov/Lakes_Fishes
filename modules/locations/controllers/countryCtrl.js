const express = require('express');
require('express-async-errors');
const axios = require('axios');
const _ = require('lodash');
const Country = require('../../../database/models/Country');

const getAllCountries = async (req, res) => {
  const countries = await Country.find();
  res.status(200).json({
    status: 'success',
    results: countries.length,
    data: {
      countries
    }
  });
};

const importCountries = async (req, res) => {
  const allImportedCountries = await axios.get(
    'https://restcountries.com/v3.1/all'
  );

  const inBaseCountries = await Country.find();

  let foundCountries = 0;
  let newCountries = 0;
  const countriesToAdd = [];

  allImportedCountries.data.forEach((element) => {
    const countryInLoop = _.find(inBaseCountries, (u) => {
      return (
        u.name === element.translations.rus.common || u.cca2 === element.cca2
      );
    });
    if (countryInLoop) {
      foundCountries++;
    } else {
      const newCountry = new Country({
        cca2: element.cca2,
        name: element.translations.rus.common
      });
      newCountries++;
      countriesToAdd.push(newCountry.save());
    }
  });

  await Promise.all(countriesToAdd);
  return res.status(200).json({
    inBase: foundCountries,
    newCountries: newCountries
  });
};

const createCountry = async (req, res) => {
  const existingCountry = await Country.findOne({
    $or: [{ name: req.body.name }, { cca2: req.body.cca2 }]
  });

  if (existingCountry) {
    return res.status(400).json({
      status: 'fail',
      message: 'Country with this name or cca2 already exists!'
    });
  }

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
