const prisma = require('../config/prisma');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, isNew } = req.query;
    
    let whereClause = {};
    if (category) {
      whereClause.category = category;
    }
    if (isNew === 'true') {
      whereClause.isNew = true;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        colors: true,
        sizes: true,
      }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        colors: true,
        sizes: true,
      }
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { name, description, price, originalPrice, discount, category, isNew, imageUrl, colors, sizes } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        originalPrice,
        discount,
        category,
        isNew,
        imageUrl,
        colors: {
          create: colors ? colors.map(hex => ({ hexCode: hex })) : [],
        },
        sizes: {
          create: sizes ? sizes.map(size => ({ size })) : [],
        }
      },
      include: { colors: true, sizes: true }
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, description, price, originalPrice, discount, category, isNew, imageUrl } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        price,
        originalPrice,
        discount,
        category,
        isNew,
        imageUrl,
      },
    });

    res.json(product);
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
