const express = require('express');
const router = express.Router();
const fieldCtrl = require('../fields/controllers/fieldCtrl');

router.get('/', fieldCtrl.getAllFields);
router.get('/:fieldId', ...fieldCtrl.getOneField);
router.put('/', ...fieldCtrl.makeOneField);
router.patch('/:fieldId', ...fieldCtrl.editOneField);
router.delete('/:fieldId', ...fieldCtrl.deleteOneField);

module.exports = router;
