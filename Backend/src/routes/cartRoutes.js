const express = require('express');
const router = express.Router();
const { getCart, addToCart, mergeCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Merge must come before /:id to avoid treating "merge" as a cart item ID
router.route('/merge')
  .post(protect, mergeCart);

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart);

router.route('/:id')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

module.exports = router;
