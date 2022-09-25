const express = require('express');
const router = express.Router();

const {registerUser, 
    loginUser, 
    logout, 
    forgotPassword,
    getUserProfile, 
    resetPassword,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUserByAdmin,
    deleteUser} = require('../controllers/authController');
const { isAuthenticatedUser, authorizedRole } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword )

router.route('/logout').post(logout);

router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);
router.route('/admin/users').get(isAuthenticatedUser, authorizedRole('admin'), allUsers);
// router.route('/admin/users/:id').get(isAuthenticatedUser, authorizedRole('admin'), getUserDetails);
router.route('/admin/users/:id')
    .get(isAuthenticatedUser, authorizedRole('admin'), getUserDetails)
    .put(isAuthenticatedUser, authorizedRole('admin'), updateUserByAdmin)
    .delete(isAuthenticatedUser, authorizedRole('admin'), deleteUser)

module.exports = router;