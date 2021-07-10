const express = require('express');
const userCtrl = require('../controllers/user-controller');
const authCtrl = require('../controllers/auth-controller');

const router = express.Router();

router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);

// TODO - forgot password route
// TODO - reset password route

// Protect all routes after this middleware
router.use(authCtrl.protect);

router
    .route('/:user_id')
    .get(userCtrl.getUser)
    .patch(userCtrl.updateUser)
    .delete(userCtrl.deleteUser);

router.use(authCtrl.restrictTo('admin'));
router.route('/').get(userCtrl.getUsers).post(userCtrl.createUser);

module.exports = router;
