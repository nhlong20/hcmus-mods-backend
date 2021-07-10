var express = require('express');
var router = express.Router();

const userCtrl = require('../controllers/user-controller');

const authCtrl = require('../controllers/auth-controller');

router.post('/', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);

router.get('/', userCtrl.getUsers);

router.use(authCtrl.protect); // req.payload

router.route('/:user_id')
    .patch(userCtrl.updateUser)
    .delete(userCtrl.deleteUser);
router.route('/:user_id')
    .get(userCtrl.getUser)
    
module.exports = router;