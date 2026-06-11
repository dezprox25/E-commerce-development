const prisma = require('../config/prisma');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: { colors: true, sizes: true }
        }
      }
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId
        }
      }
    });

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
        include: { product: { include: { colors: true, sizes: true } } }
      });
      return res.json(updatedItem);
    }

    // Add new item
    const newItem = await prisma.cartItem.create({
      data: {
        userId: req.user.id,
        productId,
        quantity: quantity || 1
      },
      include: { product: { include: { colors: true, sizes: true } } }
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Merge guest cart into user cart
// @route   POST /api/cart/merge
// @access  Private
const mergeCart = async (req, res) => {
  const { items } = req.body; // Array of { productId, quantity }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No items to merge' });
  }

  try {
    // Process each guest cart item — upsert into user's cart
    for (const item of items) {
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: req.user.id,
            productId: item.productId
          }
        }
      });

      if (existingItem) {
        // Item already in user's cart — add the guest quantity
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + (item.quantity || 1) }
        });
      } else {
        // New item — create it in the user's cart
        await prisma.cartItem.create({
          data: {
            userId: req.user.id,
            productId: item.productId,
            quantity: item.quantity || 1
          }
        });
      }
    }

    // Return the full merged cart
    const mergedCart = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: { colors: true, sizes: true }
        }
      }
    });

    res.json(mergedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  try {
    const item = await prisma.cartItem.findUnique({ where: { id: req.params.id } });

    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: req.params.id },
      data: { quantity }
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const item = await prisma.cartItem.findUnique({ where: { id: req.params.id } });

    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  mergeCart,
  updateCartItem,
  removeFromCart
};
