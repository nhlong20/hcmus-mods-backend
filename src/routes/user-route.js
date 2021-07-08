var express = require('express');
var router = express.Router();

const userCtrl = require('../controllers/user-controller');

const authServ = require('../services/auth-service');

router.post('/', userCtrl.createUser);
router.post('/login', userCtrl.loginUser);
router.get('/', userCtrl.getUsers);
// router.get('/search', userCtrl.getAllUsers);
 
router.use(authServ.isAuth); // req.payload

router.route('/:user_id')
    .patch(userCtrl.updateUser)
    .delete(userCtrl.deleteUser);
router.route('/:user_id')
    .get(userCtrl.getUser)
    
module.exports = router;