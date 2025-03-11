const express = require('express');
const router = express.Router();
const lakeCtrl = require('../lakes/controllers/lakeCtrl');

router.route('/').put(lakeCtrl.makeOneLake);
router.route('/:lakeId').get(lakeCtrl.getOneLake);
router.route('/').get(lakeCtrl.getAllLakes);

module.exports = router;
