const express = require('express');
const { createProduct, getProducts, getProductById, deleteProduct, updateProduct } = require('./controllers/productController');
const auth = require('./middleware/auth');
const upload = require('./middleware/upload');

const router = express.Router();

router.post('/', auth, upload.single('image'), createProduct);
router.get('/', auth, getProducts);
router.get('/:id', auth, getProductById);
router.delete('/:id', auth, deleteProduct);
router.put('/:id', upload.single('image'), updateProduct);

module.exports = router;
