const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // Provided by authMiddleware

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please provide a valid rating between 1 and 5." });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        productId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }

    // Create the review
    const newReview = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Recalculate product rating
    const allReviews = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    const newRating = allReviews._avg.rating || 0;
    const newCount = allReviews._count.rating || 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(newRating.toFixed(2)),
        ratingCount: newCount
      }
    });

    res.status(201).json({ 
      message: "Review added successfully.", 
      review: newReview,
      productRating: parseFloat(newRating.toFixed(2)),
      productRatingCount: newCount
    });

  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
};
