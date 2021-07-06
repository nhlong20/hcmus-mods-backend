var express = require('express');
var router = express.Router();

const courseCtrl = require('../controllers/course-controller');

// const authServ = require('../services/auth-service');

router.post('/', courseCtrl.createOne);
router.get('/:course_id', courseCtrl.getOne);
// router.post('/login', userCtrl.loginUser);
// router.get('/search', userCtrl.getAllUsers);
 
// router.use(authServ.isAuth); // req.payload

// router.route('/')
//     .put(userCtrl.updateUser)
//     .delete(userCtrl.deleteUser);
// router.route('/:id')
//     .get(userCtrl.getUser)
module.exports = router;