const express = require('express');
const reviewCtrl = require('../controllers/review-controller');
const authCtrl = require('../controllers/auth-controller');

const router = express.Router({ mergeParams: true });

router.use(authCtrl.protect);

router.route('/').get(reviewCtrl.getAll).post(reviewCtrl.createOne);

router
    .route('/:review_id')
    .get(reviewCtrl.getOne)
    .patch(authCtrl.isReviewOwner, reviewCtrl.updateOne)
    .delete(authCtrl.isReviewOwner, reviewCtrl.deleteOne);

module.exports = router;
