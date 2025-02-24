const express = require("express");

const router = express.Router();

const {protect,authorize} = require("../controllers/userController")

const { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct,uploadImage } = require('../controllers/productController');

router.route('/').get(getAllProducts).post(protect, authorize('admin'),createProduct);

router.route('/:id').get(getSingleProduct).put(protect, authorize('admin'),updateProduct).delete(protect, authorize('admin'),deleteProduct);


router.route('/upload/:id').post(protect,authorize('admin'),uploadImage);

module.exports = router;