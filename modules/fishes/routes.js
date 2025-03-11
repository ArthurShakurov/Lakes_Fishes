const express = require('express');
const router = express.Router();
const fishCtrl = require('../fishes/controllers/fishCtrl');

router.route('/').get(fishCtrl.getAllFishes);
router.route('/').put(fishCtrl.makeOneFish);
router.route('/:fishId').get(fishCtrl.getOneFish);

module.exports = router;
