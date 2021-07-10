var express = require('express');
var router = express.Router();

const courseCtrl = require('../controllers/course-controller');

router.post('/', courseCtrl.createOne);
router.get('/:course_id', courseCtrl.getOne);
router
    .route('/')
    .get(courseCtrl.getAll)
    // .post(
    //     authService.isAuth,
    //     productCtrl.setUserIds,
    //     productCtrl.createProduct
    // );
 
module.exports = router;