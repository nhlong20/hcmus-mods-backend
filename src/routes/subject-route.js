const express = require('express');
const subjectCtrl = require('../controllers/subject-controller');
const authCtrl = require('../controllers/auth-controller');

const router = express.Router();

router
    .route('/')
    .get(subjectCtrl.getAll)
    .post(
        authCtrl.protect,
        authCtrl.restrictTo('admin', 'morderator'),
        subjectCtrl.createOne
    );
    
router
    .route('/:subject_id')
    .get('/:subject_id', subjectCtrl.getOne)
    .patch(
        authCtrl.protect,
        authCtrl.restrictTo('admin', 'morderator'),
        subjectCtrl.updateOne
    );

module.exports = router;
