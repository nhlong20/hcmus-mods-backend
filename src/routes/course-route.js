const express = require('express');
const courseCtrl = require('../controllers/course-controller');
const authCtrl = require('../controllers/auth-controller');
const reviewRouter = require('./../routes/review-route');

const router = express.Router();

router.use('/:course_id/reviews', reviewRouter);

router
    .route('/')
    .get(courseCtrl.getAll)
    .post(
        authCtrl.protect,
        authCtrl.restrictTo('admin', 'morderator', 'teacher'),
        courseCtrl.createOne
    );

router.get('/:course_id', courseCtrl.getOne);

module.exports = router;
