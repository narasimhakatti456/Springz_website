# Springz Nutrition - E-commerce Website

A modern, full-stack e-commerce website for Springz Nutrition built with Next.js 15, featuring plant-based protein products and supplements.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse products with advanced filtering (category, price, flavor, size)
- **Product Details**: Comprehensive product pages with nutrition facts, reviews, and image galleries
- **Shopping Cart**: Persistent cart with quantity management
- **Checkout Process**: Multi-step checkout with address management
- **Order Tracking**: Complete order history and status tracking
- **User Profile**: Account management with address book
- **Authentication**: Secure sign-in/sign-up with role-based access

### Admin Features
- **Dashboard**: Analytics and overview of sales, orders, and products
- **Product Management**: CRUD operations for products and variants
- **Order Management**: Process and track customer orders
- **User Management**: View and manage customer accounts
- **Image Upload**: Cloudinary integration for product images

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: NextAuth.js with JWT sessions
- **Image Management**: Cloudinary integration
- **Clean Architecture**: Following clean code principles

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: NextAuth.js
- **Image Storage**: Cloudinary
- **Validation**: Zod schemas
- **UI Components**: Custom components with Radix UI primitives
- **Forms**: React Hook Form with validation
- **State Management**: React hooks and Zustand

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd springz-nutrition
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   DATABASE_URL=file:./dev.db
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses the following main models:

- **User**: Customer and admin accounts
- **Product**: Product catalog with variants
- **Category**: Product categorization
- **Order**: Customer orders with items
- **Address**: Customer shipping/billing addresses
- **Review**: Product reviews and ratings
- **CartItem**: Shopping cart items

## 🔐 Authentication

The application supports two user roles:

- **CUSTOMER**: Can browse products, place orders, manage profile
- **ADMIN**: Full access to admin dashboard and management features

### Demo Credentials

**Admin Account:**
- Email: `admin@springz.com`
- Password: `Admin@123`

**Customer Account:**
- Email: `customer1@example.com`
- Password: `Customer@123`

## 📱 Pages & Routes

### Public Pages
- `/` - Home page with hero and product categories
- `/shop` - Product catalog with filtering
- `/product/[slug]` - Product detail pages
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page

### Customer Pages
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/checkout/success` - Order confirmation
- `/orders` - Order history
- `/orders/[id]` - Order details
- `/profile` - User profile management

### Admin Pages
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/categories` - Category management

## 🎨 Design System

The application uses a consistent design system with:

- **Primary Colors**: Springz Green (#2D5016), Orange (#CC7A00)
- **Background**: Cream (#F5F1E8)
- **Typography**: Inter font family with consistent scale
- **Components**: Reusable UI components with variants

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables**
4. **Deploy**

### Environment Variables for Production

```env
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@host:5432/db
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Database Migration

For production, use PostgreSQL:

```bash
# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:pass@host:5432/db

# Run migrations
npx prisma migrate deploy
npm run db:seed
```

## 📊 API Endpoints

### Public APIs
- `GET /api/products` - Get products with filtering
- `GET /api/products/[id]` - Get single product
- `GET /api/categories` - Get categories

### Customer APIs
- `GET/POST/PATCH/DELETE /api/cart` - Cart management
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET/POST/PATCH/DELETE /api/addresses` - Address management

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET/POST/PATCH/DELETE /api/admin/products` - Product management
- `GET/PATCH /api/admin/orders` - Order management
- `POST /api/upload` - Image upload

## 🧪 Testing

The application includes:

- **Type Safety**: Full TypeScript coverage
- **Form Validation**: Zod schemas for all inputs
- **Error Handling**: Comprehensive error boundaries
- **Responsive Design**: Mobile-first approach

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@springz.com or create an issue in the repository.

---

**Springz Nutrition** - Science-grade nutrition. Everyday taste.

