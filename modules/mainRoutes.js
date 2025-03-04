const express = require('express');
const router = express.Router();
const routesCountries = require('./locations/routes');
const routesLakes = require('./lakes/routes');
const routesFishes = require('./fishes/routes');

router.use('/countries', routesCountries);
router.use('/lakes', routesLakes);
router.use('/fishes', routesFishes);

module.exports = router;
