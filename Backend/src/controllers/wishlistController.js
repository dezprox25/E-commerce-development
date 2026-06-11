const prisma = require('../config/prisma');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: true
      }
    });
    res.json(wishlistItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    // Check if item already exists
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId
        }
      }
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const newItem = await prisma.wishlistItem.create({
      data: {
        userId: req.user.id,
        productId
      },
      include: { product: true }
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const item = await prisma.wishlistItem.findUnique({ where: { id: req.params.id } });

    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    await prisma.wishlistItem.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
