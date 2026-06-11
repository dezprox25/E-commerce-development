const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getMyCancellations,
  cancelOrder,
  cancelOrderItem,
  getOrderById 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder);

router.route('/my-orders')
  .get(protect, getMyOrders);

router.route('/my-cancellations')
  .get(protect, getMyCancellations);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

router.route('/:id/items/:itemId/cancel')
  .put(protect, cancelOrderItem);

module.exports = router;
