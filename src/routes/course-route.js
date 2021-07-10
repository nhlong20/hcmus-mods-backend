var express = require('express');
const courseCtrl = require('../controllers/course-controller');
const authCtrl = require('../controllers/auth-controller');

var router = express.Router();

router.get('/:course_id', courseCtrl.getOne);
router
    .route('/')
    .get(courseCtrl.getAll)
    .post(
        authCtrl.protect,
        authCtrl.restrictTo('admin', 'morderator', 'teacher'),
        courseCtrl.createOne
    );

module.exports = router;
