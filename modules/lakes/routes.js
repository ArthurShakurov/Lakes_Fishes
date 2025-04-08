const express = require('express');
const router = express.Router();
const lakeCtrl = require('../lakes/controllers/lakeCtrl');

router.put('/', ...lakeCtrl.makeOneLake);
router.get('/:lakeId', ...lakeCtrl.getOneLake);
router.get('/', lakeCtrl.getAllLakes);
router.patch('/:lakeId', ...lakeCtrl.editOneLake);
router.delete('/:lakeId', ...lakeCtrl.deleteOneLake);

module.exports = router;
