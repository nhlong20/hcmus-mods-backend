const express = require('express');
const reviewCtrl = require('../controllers/review-controller');
const authCtrl = require('../controllers/auth-controller');

const router = express.Router({ mergeParams: true });

router.use(authCtrl.protect);

router
  .route('/')
  .get(reviewCtrl.getAll)
  .post(
    // reviewCtrl.setTourUserIds,
    reviewCtrl.createOne
  );

router
  .route('/:review_id')
  .get(reviewCtrl.getOne)
//   .patch(
//     authCtrl.restrictTo('user', 'admin'),
//     reviewCtrl.updateReview
//   )
//   .delete(
//     authCtrl.restrictTo('user', 'admin'),
//     reviewCtrl.deleteReview
//   );

module.exports = router;
