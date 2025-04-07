const express = require('express');
const router = express.Router();
const fishCtrl = require('../fishes/controllers/fishCtrl');

router.get('/', fishCtrl.getAllFishes);
router.put('/', ...fishCtrl.makeOneFish);
router.get('/:fishId', ...fishCtrl.getOneFish);
router.patch('/:fishId', ...fishCtrl.editOneFish);

module.exports = router;
