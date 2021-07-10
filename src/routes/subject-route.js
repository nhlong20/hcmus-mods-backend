var express = require('express');
var router = express.Router();

const subjectCtrl = require('../controllers/subject-controller');

router.post('/', subjectCtrl.createOne);
router.get('/:subject_id', subjectCtrl.getOne);

router.patch('/:subject_id', subjectCtrl.updateOne);
router.route('/').get(subjectCtrl.getAll);

module.exports = router;
