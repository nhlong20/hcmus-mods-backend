const express = require('express');
const userCtrl = require('../controllers/user-controller');
const authCtrl = require('../controllers/auth-controller');

const router = express.Router();

router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);

// TODO - forgot password route
// TODO - reset password route

// Protect all routes after this middleware
router.use(authCtrl.protect);
router
    .route('/students/:user_id')
    .get(userCtrl.getOne('student'))
    .patch(userCtrl.updateOne('student'))
    .delete(userCtrl.deleteOne('student'));

router.use(authCtrl.restrictTo('admin', 'moderator', 'teacher'));
router
    .route('/teachers/:user_id')
    .get(userCtrl.getOne('teacher'))
    .patch(userCtrl.updateOne('teacher'))
    .delete(userCtrl.deleteOne('teacher'));

router.use(authCtrl.restrictTo('admin', 'moderator'));
router
    .route('/moderators/:user_id')
    .get(userCtrl.getOne('moderator'))
    .patch(userCtrl.updateOne('moderator'))
    .delete(userCtrl.deleteOne('moderator'));

router.use(authCtrl.restrictTo('admin'));
router
    .route('/admin/:user_id')
    .get(userCtrl.getOne('admin'))
    .patch(userCtrl.updateOne('admin'))
    .delete(userCtrl.deleteOne('admin'));

router.route('/moderators').get(userCtrl.getAll('moderator'));
router.route('/students').get(userCtrl.getAll('student'));
router.route('/teachers').get(userCtrl.getAll('teacher'));
router.route('/admin').get(userCtrl.getAll('admin'));
router.route('/signup').post(authCtrl.createUser);

module.exports = router;
