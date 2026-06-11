const prisma = require('../config/prisma');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

  // --- Server-side validation ---
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  if (!shippingAddress || shippingAddress.trim() === '') {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  if (!paymentMethod || paymentMethod.trim() === '') {
    return res.status(400).json({ message: 'Payment method is required' });
  }

  if (!totalAmount || Number(totalAmount) <= 0) {
    return res.status(400).json({ message: 'Total amount must be greater than zero' });
  }

  try {
    // Create the order and clear the user's cart in a single transaction
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          userId: req.user.id,
          shippingAddress: shippingAddress.trim(),
          paymentMethod: paymentMethod.trim(),
          totalAmount,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      }),
      // Clear user's cart after order is placed
      prisma.cartItem.deleteMany({
        where: { userId: req.user.id },
      }),
    ]);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user cancellations
// @route   GET /api/orders/my-cancellations
// @access  Private
const getMyCancellations = async (req, res) => {
  try {
    // Find all orders that are either completely cancelled or have at least one cancelled item
    const cancelledOrders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
        OR: [
          { status: 'CANCELLED' },
          { items: { some: { status: 'CANCELLED' } } }
        ]
      },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(cancelledOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel an entire order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ message: `Cannot cancel order in ${order.status} state` });
    }

    // Cancel order and all its items
    const updatedOrder = await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' }
      }),
      prisma.orderItem.updateMany({
        where: { orderId: order.id },
        data: { status: 'CANCELLED' }
      })
    ]);

    res.json(updatedOrder[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a single order item
// @route   PUT /api/orders/:id/items/:itemId/cancel
// @access  Private
const cancelOrderItem = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ message: `Cannot modify items for order in ${order.status} state` });
    }

    const itemToCancel = order.items.find(item => item.id === req.params.itemId);

    if (!itemToCancel) {
      return res.status(404).json({ message: 'Item not found in order' });
    }

    if (itemToCancel.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Item is already cancelled' });
    }

    // Determine how many active items will be left
    const activeItemsLeft = order.items.filter(item => item.status === 'ACTIVE' && item.id !== itemToCancel.id);

    const itemTotal = Number(itemToCancel.price) * itemToCancel.quantity;
    const newOrderTotalAmount = Number(order.totalAmount) - itemTotal;

    if (activeItemsLeft.length === 0) {
      // If this was the last active item, cancel the entire order
      const cancelledOrder = await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: 'CANCELLED', totalAmount: 0 }
        }),
        prisma.orderItem.update({
          where: { id: itemToCancel.id },
          data: { status: 'CANCELLED' }
        })
      ]);
      return res.json(cancelledOrder[0]);
    } else {
      // Otherwise just cancel the item and deduct the amount
      const updatedOrder = await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { totalAmount: newOrderTotalAmount }
        }),
        prisma.orderItem.update({
          where: { id: itemToCancel.id },
          data: { status: 'CANCELLED' }
        })
      ]);
      return res.json(updatedOrder[0]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { firstName: true, email: true } },
        items: { include: { product: true } }
      }
    });

    if (order && (order.userId === req.user.id || req.user.role === 'ADMIN')) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getMyCancellations,
  cancelOrder,
  cancelOrderItem,
  getOrderById,
};
