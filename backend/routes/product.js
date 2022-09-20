const express = require('express');
const router = express.Router();

const {getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct} = require('../controllers/productController')
const {isAuthenticatedUser, authorizedRole} = require('../middlewares/auth');

router.route('/product').get(isAuthenticatedUser,getProducts);
router.route('/admin/product/new').post(isAuthenticatedUser, authorizedRole('admin'), newProduct);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizedRole('admin'), updateProduct);
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizedRole('admin'), deleteProduct);

module.exports = router; 