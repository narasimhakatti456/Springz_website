import bcrypt from 'bcryptjs'

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@springznutrition.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@springznutrition.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create demo customer
  const customerPassword = await bcrypt.hash('customer123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'Demo Customer',
      email: 'customer@example.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  })

  console.log('✅ Demo customer created:', customer.email)

  // Create categories
  const proteinCategory = await prisma.category.upsert({
    where: { slug: 'protein-powders' },
    update: {},
    create: {
      slug: 'protein-powders',
      name: 'Protein Powders',
      description: 'High-quality plant-based protein powders for muscle building and recovery.',
    },
  })

  const supplementsCategory = await prisma.category.upsert({
    where: { slug: 'supplements' },
    update: {},
    create: {
      slug: 'supplements',
      name: 'Supplements',
      description: 'Essential vitamins, minerals, and performance supplements.',
    },
  })

  const superfoodsCategory = await prisma.category.upsert({
    where: { slug: 'superfoods' },
    update: {},
    create: {
      slug: 'superfoods',
      name: 'Superfoods',
      description: 'Nutrient-dense superfoods for optimal health and wellness.',
    },
  })

  console.log('✅ Categories created')

  // Create sample products
  const premiumProtein = await prisma.product.upsert({
    where: { slug: 'premium-plant-protein' },
    update: {},
    create: {
      slug: 'premium-plant-protein',
      title: 'Premium Plant Protein',
      description: 'DIAAS-100% certified plant protein with complete amino acid profile. Perfect for muscle building and recovery.',
      categoryId: proteinCategory.id,
      images: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500,https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500,https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
      features: 'DIAAS-100% Certified,Complete Amino Acid Profile,No Artificial Additives,Easily Digestible,Sustainably Sourced,Third-Party Tested',
      nutritionJson: JSON.stringify({
        protein: '25g',
        calories: '120',
        carbs: '3g',
        fat: '2g',
        fiber: '2g',
        sugar: '1g'
      }),
    },
  })

  // Create variants for the protein
  await prisma.variant.upsert({
    where: { sku: 'PPP-500-VAN' },
    update: {},
    create: {
      productId: premiumProtein.id,
      sku: 'PPP-500-VAN',
      size: '500g',
      flavor: 'Vanilla',
      priceInINR: 149900, // ₹1499.00
      compareAtInINR: 179900, // ₹1799.00
      stock: 50,
      isActive: true,
    },
  })

  await prisma.variant.upsert({
    where: { sku: 'PPP-500-CHO' },
    update: {},
    create: {
      productId: premiumProtein.id,
      sku: 'PPP-500-CHO',
      size: '500g',
      flavor: 'Chocolate',
      priceInINR: 149900, // ₹1499.00
      compareAtInINR: 179900, // ₹1799.00
      stock: 30,
      isActive: true,
    },
  })

  await prisma.variant.upsert({
    where: { sku: 'PPP-1000-VAN' },
    update: {},
    create: {
      productId: premiumProtein.id,
      sku: 'PPP-1000-VAN',
      size: '1000g',
      flavor: 'Vanilla',
      priceInINR: 249900, // ₹2499.00
      compareAtInINR: 299900, // ₹2999.00
      stock: 25,
      isActive: true,
    },
  })

  console.log('✅ Premium Plant Protein created with variants')

  // Create another product
  const bcaaSupply = await prisma.product.upsert({
    where: { slug: 'bcaa-energy-blend' },
    update: {},
    create: {
      slug: 'bcaa-energy-blend',
      title: 'BCAA Energy Blend',
      description: 'Advanced BCAA formula with natural caffeine for enhanced performance and recovery.',
      categoryId: supplementsCategory.id,
      images: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500,https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
      features: '7g BCAAs per serving,Natural Caffeine,Zero Sugar,Electrolyte Blend,Pre & Post Workout,Tropical Flavor',
      nutritionJson: JSON.stringify({
        bcaas: '7g',
        caffeine: '100mg',
        calories: '5',
        carbs: '0g',
        electrolytes: '150mg'
      }),
    },
  })

  await prisma.variant.upsert({
    where: { sku: 'BCAA-300-TRO' },
    update: {},
    create: {
      productId: bcaaSupply.id,
      sku: 'BCAA-300-TRO',
      size: '300g',
      flavor: 'Tropical',
      priceInINR: 89900, // ₹899.00
      compareAtInINR: 109900, // ₹1099.00
      stock: 40,
      isActive: true,
    },
  })

  console.log('✅ BCAA Energy Blend created')

  // Create sample reviews
  await prisma.review.upsert({
    where: { productId_userId: { productId: premiumProtein.id, userId: customer.id } },
    update: {},
    create: {
      productId: premiumProtein.id,
      userId: customer.id,
      rating: 5,
      title: 'Excellent quality protein!',
      content: 'This protein powder mixes well and tastes great. I can definitely feel the difference in my workouts and recovery.',
    },
  })

  console.log('✅ Sample reviews created')

  // Create customer address
  await prisma.address.upsert({
    where: { id: 'demo-address-1' },
    update: {},
    create: {
      id: 'demo-address-1',
      userId: customer.id,
      type: 'SHIPPING',
      fullName: 'Demo Customer',
      phone: '+91 9876543210',
      line1: '123 Main Street',
      line2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      isDefault: true,
    },
  })

  console.log('✅ Demo address created')

  console.log('🎉 Database seeding completed!')
  console.log('')
  console.log('📧 Admin Login:')
  console.log('   Email: admin@springznutrition.com')
  console.log('   Password: admin123')
  console.log('')
  console.log('📧 Customer Login:')
  console.log('   Email: customer@example.com')
  console.log('   Password: customer123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })