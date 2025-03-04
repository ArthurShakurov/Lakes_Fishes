const express = require('express');
require('express-async-errors');
const _ = require('lodash');
const Fish = require('../../../database/models/Fish');
const Lake = require('../../../database/models/Lake');

const getAllFishes = async (req, res) => {
  const fishes = await Fish.find();

  res.json({
    success: true,
    results: fishes.length,
    data: {
      fishes
    }
  });
};

const getOneFish = async (req, res) => {
  const { fishId } = req.params;
  const fish = await Fish.findOne({ _id: fishId }).populate('lake');

  res.json({
    seccess: true,
    data: {
      id: fishId,
      name: fish.name,
      lake: {
        name: fish.lake?.name,
        id: fish.lake?._id
      }
    }
  });
};

const makeOneFish = async (req, res) => {
  const { name, lakeId } = req.body;
  const lake = await Lake.findOne({ _id: lakeId });

  if (!lake) {
    throw new Error(`No lake with id: ${lakeId}`);
  }

  const fish = new Fish({
    name,
    lake: lakeId,
    timeOfCreation: Date.now()
  });

  await fish.save();
  res.json({
    success: true,
    newFishId: fish._id
  });
};

module.exports = {
  getAllFishes,
  getOneFish,
  makeOneFish
};
