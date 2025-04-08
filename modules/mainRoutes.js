const express = require('express');
const router = express.Router();
const routesCountries = require('./locations/routes');
const routesLakes = require('./lakes/routes');
const routesFishes = require('./fishes/routes');
const testActions = require('../testActions');
const routesAnimal = require('./animal/routes');
const routesFields = require('./fields/routes');

router.use('/countries', routesCountries);
router.use('/lakes', routesLakes);
router.use('/fishes', routesFishes);
router.use('/test', testActions);
router.use('/fields', routesFields);
router.use('/animal', routesAnimal);

module.exports = router;
