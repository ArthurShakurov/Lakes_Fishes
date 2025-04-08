const express = require('express');
const router = express.Router();
const animalCtrl = require('../animal/controllers/animalCtrl');

router.get('/', animalCtrl.getAllAnimal);
router.get('/:animalId', ...animalCtrl.getOneAnimal);
router.put('/', ...animalCtrl.makeOneAnimal);
router.patch('/:animalId', ...animalCtrl.editOneAnimal);
router.delete('/:animalId', ...animalCtrl.deleteOneAnimal);

module.exports = router;
