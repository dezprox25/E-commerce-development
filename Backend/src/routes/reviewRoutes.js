const express = require('express');
const router = express.Router();
const { getProductReviews, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Route to get all reviews for a product (public)
router.get('/:productId', getProductReviews);

// Route to add a review for a product (protected)
router.post('/:productId', protect, addReview);

module.exports = router;
