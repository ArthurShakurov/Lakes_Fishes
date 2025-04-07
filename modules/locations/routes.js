const express = require('express');
const router = express.Router();
const countryCtrl = require('./controllers/countryCtrl');

router
  .route('/')
  .get(countryCtrl.getAllCountries)
  .put(countryCtrl.createCountry);

router.route('/:countryId').get(countryCtrl.getOneCountry);
router.route('/:countryId').patch(countryCtrl.editOneCountry);

router.route('/import').post(countryCtrl.importCountries);

module.exports = router;
