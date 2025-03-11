const express = require('express');
require('express-async-errors');
const _ = require('lodash');
const Fish = require('../../../database/models/Fish');
const Lake = require('../../../database/models/Lake');
const { fishToClient, fishesToClient } = require('../helpers/fishConverter');
const Country = require('../../../database/models/Country');

const getAllFishes = async (req, res) => {
  const fishes = await Fish.find()
    .populate('lakes', 'name country')
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

const getOneFish = async (req, res) => {
  const { fishId } = req.params;

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
};

const makeOneFish = async (req, res) => {
  const { name, lake } = req.body;
  console.log('req.body', req.body);

  const foundlakes = await Lake.findOne({ _id: { $in: lake } });

  if (!foundlakes) {
    console.log(lake);
    throw new Error(`No lake with id: ${lake}`);
  }

  const fish = new Fish({
    name,
    lakes: lake,
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
