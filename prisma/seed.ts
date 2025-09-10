import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@springz.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@springz.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  })

  // Create demo customers
  const customer1PasswordHash = await bcrypt.hash('Customer@123', 12)
  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer1@example.com',
      passwordHash: customer1PasswordHash,
      role: 'CUSTOMER',
    },
  })

  const customer2PasswordHash = await bcrypt.hash('Customer@123', 12)
  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'customer2@example.com',
      passwordHash: customer2PasswordHash,
      role: 'CUSTOMER',
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'premium-plant-proteins' },
      update: {},
      create: {
        slug: 'premium-plant-proteins',
        name: 'Premium Plant Proteins',
        description: 'High-quality plant-based protein powders for optimal nutrition',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'functional-foods' },
      update: {},
      create: {
        slug: 'functional-foods',
        name: 'Functional Foods',
        description: 'Nutrient-dense functional foods for everyday wellness',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'guilt-free-snacks' },
      update: {},
      create: {
        slug: 'guilt-free-snacks',
        name: 'Guilt-Free Snacks',
        description: 'Healthy, high-protein snacks for any time of day',
      },
    }),
  ])

  // Create products
  const products = await Promise.all([
    // Premium Plant Proteins
    prisma.product.upsert({
      where: { slug: 'premium-plant-protein' },
      update: {},
      create: {
        slug: 'premium-plant-protein',
        title: 'Premium Plant Protein',
        description: 'Clean, high-digestibility plant protein for real-world performance. DIAAS-100% formulation for superior amino acid availability.',
        categoryId: categories[0].id,
        images: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500,https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
        nutritionJson: JSON.stringify({
          servingSize: '35g',
          calories: 135,
          protein: 25,
          carbs: 6,
          fat: 3.5,
          sugar: 0.5,
          fiber: 2,
        }),
        features: 'DIAAS-100% formulation,No added sugar,Spirulina enriched,Easy to digest,Clean label,FSSAI & GMP certified',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'native-protein-classic' },
      update: {},
      create: {
        slug: 'native-protein-classic',
        title: 'Native Protein Classic',
        description: 'Traditional plant protein with authentic taste and superior nutrition.',
        categoryId: categories[0].id,
        images: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500',
        nutritionJson: JSON.stringify({
          servingSize: '30g',
          calories: 123,
          protein: 25,
          carbs: 4,
          fat: 2,
          sugar: 0,
          fiber: 1.5,
        }),
        features: 'Native protein blend,No added sugar,Easy to mix,Great taste',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'native-protein-chocolate' },
      update: {},
      create: {
        slug: 'native-protein-chocolate',
        title: 'Native Protein Chocolate',
        description: 'Rich chocolate flavor with the same great nutrition profile.',
        categoryId: categories[0].id,
        images: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
        nutritionJson: JSON.stringify({
          servingSize: '30g',
          calories: 126,
          protein: 23,
          carbs: 3,
          fat: 2.5,
          sugar: 0,
          fiber: 1.5,
        }),
        features: 'Rich chocolate flavor,No added sugar,Easy to mix,Great taste',
      },
    }),

    // Functional Foods
    prisma.product.upsert({
      where: { slug: 'peanut-butter-powder-sweetened' },
      update: {},
      create: {
        slug: 'peanut-butter-powder-sweetened',
        title: 'Peanut Butter Powder - Sweetened',
        description: 'Delicious peanut butter powder with natural sweetness. Perfect for smoothies and baking.',
        categoryId: categories[1].id,
        images: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500',
        nutritionJson: JSON.stringify({
          servingSize: '20g',
          calories: 52,
          protein: 6,
          carbs: 4,
          fat: 1.5,
          sugar: 1,
          fiber: 2,
        }),
        features: 'Natural sweetness,High protein,Low fat,Versatile use',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'peanut-butter-powder-spicy' },
      update: {},
      create: {
        slug: 'peanut-butter-powder-spicy',
        title: 'Peanut Butter Powder - Hot & Spicy',
        description: 'Spicy twist on classic peanut butter powder. Perfect for savory dishes.',
        categoryId: categories[1].id,
        images: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500',
        nutritionJson: JSON.stringify({
          servingSize: '20g',
          calories: 52,
          protein: 6,
          carbs: 4,
          fat: 1.5,
          sugar: 1,
          fiber: 2,
        }),
        features: 'Hot & spicy flavor,High protein,Low fat,Versatile use',
      },
    }),

    // Guilt-Free Snacks
    prisma.product.upsert({
      where: { slug: 'high-protein-kodubale' },
      update: {},
      create: {
        slug: 'high-protein-kodubale',
        title: 'High Protein Kodubale',
        description: 'Traditional South Indian snack made healthy with added protein.',
        categoryId: categories[2].id,
        images: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
        nutritionJson: JSON.stringify({
          servingSize: '30g',
          calories: 140,
          protein: 12,
          carbs: 14,
          fat: 5,
          sugar: 0,
          fiber: 3,
        }),
        features: 'Traditional taste,High protein,No added sugar,Crunchy texture',
      },
    }),
  ])

  // Create variants for each product
  const variants = []
  for (const product of products) {
    if (product.slug === 'premium-plant-protein') {
      variants.push(
        await prisma.variant.upsert({
          where: { sku: 'PPP-900G' },
          update: {},
          create: {
            productId: product.id,
            sku: 'PPP-900G',
            size: '900g',
            priceInINR: 149900, // ₹1,499
            compareAtInINR: 179900, // ₹1,799
            stock: 50,
          },
        })
      )
    } else if (product.slug === 'native-protein-classic') {
      variants.push(
        await prisma.variant.upsert({
          where: { sku: 'NPC-500G' },
          update: {},
          create: {
            productId: product.id,
            sku: 'NPC-500G',
            size: '500g',
            priceInINR: 89900, // ₹899
            stock: 30,
          },
        })
      )
    } else if (product.slug === 'native-protein-chocolate') {
      variants.push(
        await prisma.variant.upsert({
          where: { sku: 'NPC-CHOC-500G' },
          update: {},
          create: {
            productId: product.id,
            sku: 'NPC-CHOC-500G',
            size: '500g',
            flavor: 'Chocolate',
            priceInINR: 89900, // ₹899
            stock: 25,
          },
        })
      )
    } else if (product.slug === 'peanut-butter-powder-sweetened') {
      variants.push(
        await prisma.variant.upsert({
          where: { sku: 'PBP-SWEET-200G' },
          update: {},
          create: {
            productId: product.id,
            sku: 'PBP-SWEET-200G',
            size: '200g',
            flavor: 'Sweetened',
            priceInINR: 29900, // ₹299
            stock: 40,
          },
        })
      )
    } else if (product.slug === 'peanut-butter-powder-spicy') {
      variants.push(
        await prisma.variant.upsert({
          where: { sku: 'PBP-SPICY-200G' },
          update: {},
          create: {
            productId: product.id,
            sku: 'PBP-SPICY-200G',
            size: '200g',
            flavor: 'Hot & Spicy',
            priceInINR: 29900, // ₹299
            stock: 35,
          },
        })
      )
    } else if (product.slug === 'high-protein-kodubale') {
      variants.push(
        await prisma.variant.upsert({
          where: { sku: 'HPK-100G' },
          update: {},
          create: {
            productId: product.id,
            sku: 'HPK-100G',
            size: '100g',
            priceInINR: 19900, // ₹199
            stock: 60,
          },
        })
      )
    }
  }

  // Create addresses for customers
  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        userId: customer1.id,
        type: 'SHIPPING',
        fullName: 'John Doe',
        phone: '+91 9876543210',
        line1: '123 Main Street',
        line2: 'Apt 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: customer2.id,
        type: 'SHIPPING',
        fullName: 'Jane Smith',
        phone: '+91 9876543211',
        line1: '456 Park Avenue',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        isDefault: true,
      },
    }),
  ])

  // Create reviews
  const reviews = []
  for (const product of products) {
    // Create one review per customer per product
    reviews.push(
      await prisma.review.upsert({
        where: {
          productId_userId: {
            productId: product.id,
            userId: customer1.id,
          },
        },
        update: {},
        create: {
          productId: product.id,
          userId: customer1.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          title: `Great product!`,
          content: `Really love this product. Great quality and taste. Highly recommended!`,
        },
      })
    )
    
    reviews.push(
      await prisma.review.upsert({
        where: {
          productId_userId: {
            productId: product.id,
            userId: customer2.id,
          },
        },
        update: {},
        create: {
          productId: product.id,
          userId: customer2.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          title: `Excellent quality!`,
          content: `Amazing product with great nutritional value. Will definitely buy again!`,
        },
      })
    )
  }

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: customer1.id,
        number: 'ORD-001',
        status: 'DELIVERED',
        subtotalInINR: 149900,
        shippingInINR: 3000,
        totalInINR: 152900,
        paymentStatus: 'PAID',
        trackingNumber: 'TRK123456789',
        shippingAddressId: addresses[0].id,
        billingAddressId: addresses[0].id,
      },
    }),
    prisma.order.create({
      data: {
        userId: customer2.id,
        number: 'ORD-002',
        status: 'SHIPPED',
        subtotalInINR: 179800,
        shippingInINR: 3000,
        totalInINR: 182800,
        paymentStatus: 'PAID',
        trackingNumber: 'TRK987654321',
        shippingAddressId: addresses[1].id,
        billingAddressId: addresses[1].id,
      },
    }),
    prisma.order.create({
      data: {
        userId: customer1.id,
        number: 'ORD-003',
        status: 'PROCESSING',
        subtotalInINR: 29900,
        shippingInINR: 3000,
        totalInINR: 32900,
        paymentStatus: 'PAID',
        shippingAddressId: addresses[0].id,
        billingAddressId: addresses[0].id,
      },
    }),
  ])

  // Create order items
  await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: orders[0].id,
        productId: products[0].id,
        variantId: variants[0].id,
        qty: 1,
        priceInINR: 149900,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[1].id,
        productId: products[1].id,
        variantId: variants[1].id,
        qty: 2,
        priceInINR: 89900,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[2].id,
        productId: products[3].id,
        variantId: variants[3].id,
        qty: 1,
        priceInINR: 29900,
      },
    }),
  ])

  console.log('✅ Seed completed successfully!')
  console.log(`👤 Created ${3} users (1 admin, 2 customers)`)
  console.log(`📦 Created ${categories.length} categories`)
  console.log(`🛍️ Created ${products.length} products`)
  console.log(`📊 Created ${variants.length} variants`)
  console.log(`⭐ Created ${reviews.length} reviews`)
  console.log(`📋 Created ${orders.length} orders`)
  console.log(`🏠 Created ${addresses.length} addresses`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
