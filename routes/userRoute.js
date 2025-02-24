const express = require('express');
const router = express.Router();

const { register, login, protect, authorize,logout,getAllUsers,getSingleUser,currentUser,updateUser,updateUserPassword } = require('../controllers/userController');

router.route('/register').post(register);
router.route('/login').post(login);

router.route('/logout').post(logout);
router.route('/').get(protect,authorize('admin'),getAllUsers);
router.route('/me').get(protect,currentUser);
router.route('/:id').get(protect,authorize('admin'),getSingleUser).put(protect,authorize('admin'),updateUser);

router.route("change-password/:id").put(protect,updateUserPassword);
module.exports = router;