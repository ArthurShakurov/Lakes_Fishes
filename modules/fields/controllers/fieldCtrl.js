const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
const _ = require('lodash');
const Field = require('../../../database/models/Field');
const Country = require('../../../database/models/Country');
const { body, validationResult, param } = require('express-validator');
const {
  fieldToClient,
  fieldsToClient,
  fieldToClientFull
} = require('../helpers/fieldConverter');

const fieldValidation = [
  body('name').notEmpty().isLength({ min: 2 }),
  body('size').notEmpty().isNumeric()
];

const convertFieldToDb = (req, field) => {
  field.name = req.name;
  field.country = new mongoose.Types.ObjectId(req.countryId);
  field.size = req.size;
};

const getAllFields = async (req, res) => {
  const query = {};
  const { name, fieldId, countryId } = req.body;

  //if(name)
  //if(fieldId)
  //if(countryId)

  const fields = await Field.find(query).populate('country');

  res.json({
    sucess: true,
    results: fields.length,
    fields: fieldsToClient(fields)
  });
};

const getOneField = [
  param('fieldId').isMongoId().withMessage('Id should be MongoId'),

  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }

    const { fieldId } = req.params;

    const field = await Field.findOne({ _id: fieldId }).populate('country');

    res.json({
      success: true,
      field: fieldToClientFull(field)
    });
  }
];

const makeOneField = [
  ...fieldValidation,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }

    const { name, countryId, size } = req.body;

    console.log(121);
    const country = await Country.findOne({ _id: countryId });

    console.log(country);
    if (!country) {
      throw new Error(`No country with id: ${countryId}`);
    }

    const field = new Field({
      name,
      country,
      size
    });

    await field.save();

    res.json({
      success: true,
      field: fieldToClientFull(field)
    });
  }
];

const editOneField = [
  param('fieldId').isMongoId().withMessage('...fieldId should be MongoID'),
  ...fieldValidation,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('result', result);
      res.send({ errors: result.array() });
    }

    const { name, countryId, size } = req.body;

    const { fieldId } = req.params;

    const field = await Field.findOne({ _id: fieldId });
    if (!field) {
      throw new Error(`No field with id: ${fieldId}`);
    }

    if (countryId) {
      const country = await Country.findOne({ _id: countryId });
      if (!country) {
        throw new Error(`No country with id: ${countryId}`);
      }
    }

    convertFieldToDb(req.body, field);

    await field.save();

    res.json({
      success: true,
      field: fieldToClientFull(field)
    });
  }
];

const deleteOneField = [
  param('fieldId').isMongoId().withMessage('... should be MongoID'),
  async (req, res) => {
    const { fieldId } = req.params;

    const field = await Field.findOne({ _id: { $in: fieldId } });
    if (!field) {
      throw new Error(`No field with id: ${fieldId}`);
    }

    await Field.findByIdAndDelete(fieldId);

    res.json({
      success: true,
      message: 'Field have been deleted'
    });
  }
];

module.exports = {
  getAllFields,
  getOneField,
  makeOneField,
  editOneField,
  deleteOneField
};
