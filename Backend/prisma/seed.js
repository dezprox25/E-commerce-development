const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const categories = [
  "electronics", "gaming", "mens-fashion", "womens-fashion", 
  "home-lifestyle", "medicine", "sports-outdoor", "toys", "groceries", "health-beauty"
];

const adjectives = ["Premium", "Essential", "Luxury", "Smart", "Classic", "Modern", "Pro", "Ultra", "Compact", "Wireless"];
const nouns = {
  "electronics": ["Monitor", "Keyboard", "Mouse", "Laptop", "Camera", "Headphones"],
  "gaming": ["Controller", "Headset", "Console", "Chair", "Desk", "Gamepad"],
  "mens-fashion": ["Jacket", "T-Shirt", "Jeans", "Sneakers", "Watch", "Suit"],
  "womens-fashion": ["Dress", "Handbag", "Shoes", "Coat", "Sunglasses", "Top"],
  "home-lifestyle": ["Sofa", "Lamp", "Table", "Rug", "Vase", "Mirror"],
  "medicine": ["Vitamins", "First Aid Kit", "Thermometer", "Painkillers", "Bandages", "Supplement"],
  "sports-outdoor": ["Tent", "Backpack", "Water Bottle", "Running Shoes", "Dumbbells", "Yoga Mat"],
  "toys": ["Action Figure", "Board Game", "Puzzle", "RC Car", "Doll", "Building Blocks"],
  "groceries": ["Dog Food", "Coffee Beans", "Olive Oil", "Cereal", "Pasta", "Snacks"],
  "health-beauty": ["Skincare Set", "Perfume", "Shampoo", "Lotion", "Makeup Kit", "Trimmer"]
};

const reviewComments = [
  "Amazing product, totally worth the price!",
  "Good quality, but shipping was a bit slow.",
  "Exactly what I was looking for. Highly recommend.",
  "Decent, does the job well.",
  "Not bad, but could be better.",
  "I absolutely love this! 5 stars.",
  "The build quality is fantastic.",
  "A bit overpriced for what it offers.",
  "Works perfectly out of the box.",
  "My new favorite thing!"
];

async function main() {
  console.log('Start seeding...');
  
  // Clear everything (cascading will help, but let's be explicit)
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.productColor.deleteMany({});
  await prisma.productSize.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('Cleared database.');

  let mockProducts = [];

  categories.forEach(cat => {
    for (let i = 0; i < 6; i++) { // Generate 6 items per category
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const nounArr = nouns[cat];
      const noun = nounArr[Math.floor(Math.random() * nounArr.length)];
      
      const originalPrice = Math.floor(Math.random() * 500) + 50;
      const hasDiscount = Math.random() > 0.6;
      const discount = hasDiscount ? Math.floor(Math.random() * 40) + 10 : 0;
      const price = originalPrice - (originalPrice * (discount / 100));

      const hasColors = Math.random() > 0.5;
      const colors = hasColors ? ["#000000", "#E07575", "#A0BCE0"].slice(0, Math.floor(Math.random() * 3) + 1) : [];

      mockProducts.push({
        name: `${adj} ${noun}`,
        price: parseFloat(price.toFixed(2)),
        originalPrice: originalPrice,
        discount: discount,
        rating: 0,
        ratingCount: 0,
        stockQuantity: Math.floor(Math.random() * 11), // 0 to 10
        category: cat,
        isNew: Math.random() > 0.7,
        imageUrl: "https://via.placeholder.com/270x250",
        colors: {
          create: colors.map(c => ({ hexCode: c }))
        },
        sizes: {
          create: ["XS", "S", "M", "L", "XL"].map(s => ({ size: s }))
        }
      });
    }
  });

  for (const p of mockProducts) {
    const product = await prisma.product.create({
      data: p
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
