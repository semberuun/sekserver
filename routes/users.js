const express = require('express');
const { protect, authorize } = require('../middleware/protect');

const { register, userLogin, userLogout, getUsers, updateUser, deleteUser, getUser, resetPassword, userRefresh, rightUser } = require("../controller/users");

const router = express.Router();

router.route('/register').post(register);
router.route('/refresh').get(protect, userRefresh);
router.route('/login').post(userLogin);
router.route('/logout').get(userLogout);
router.route('/reset-password').post(resetPassword);
router.route('/').get(protect, authorize('admin'), getUsers);
router.route('/:id').put(protect, updateUser).delete(protect, authorize('admin'), deleteUser).get(protect, authorize('admin'), getUser);
router.route('/:id/change-right').put(protect, authorize('admin'), rightUser);

module.exports = router;



