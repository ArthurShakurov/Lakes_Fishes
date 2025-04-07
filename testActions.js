const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Country = require('./database/models/Country');
const Lake = require('./database/models/Lake');
const Fish = require('./database/models/Fish');

const testAction = async (req, res) => {
  // удаления поля "color" у стран
  // await Country.updateMany({}, { $unset: { color: 1 } });

  //добавление поля "muslim" у стран
  // await Country.updateMany({}, { muslim: 'false' });

  // добавление поля "saulted" у озёр
  // await Lake.updateMany({}, { saulted: false });

  // добавление цвета у рыб
  // await Fish.updateMany({}, { color: 'pinky' });

  res.json({
    success: true
  });
};

router.route('/').delete(testAction);

module.exports = testAction;
