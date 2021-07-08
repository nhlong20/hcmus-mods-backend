var express = require('express');
var router = express.Router();

const subjectCtrl = require('../controllers/subject-controller');
const authServ = require('../services/auth-service');

router.post('/', subjectCtrl.createOne);
router.get('/:subject_id', subjectCtrl.getOne);
router.route('/').get(subjectCtrl.getAll);

module.exports = router;
