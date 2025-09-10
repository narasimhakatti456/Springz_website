# Deployment Guide - Springz Nutrition

This guide covers deploying the Springz Nutrition e-commerce website to production.

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account
- Cloudinary account
- PostgreSQL database (Neon, Supabase, or Railway)

### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure all environment variables are documented in `env.example`

### Step 2: Set up Database
1. Create a PostgreSQL database (recommended providers):
   - [Neon](https://neon.tech/) (free tier available)
   - [Supabase](https://supabase.com/) (free tier available)
   - [Railway](https://railway.app/) (free tier available)

2. Get your database connection string:
   ```
   postgresql://username:password@host:port/database
   ```

### Step 3: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Step 4: Environment Variables
Add these environment variables in Vercel:

```env
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app
DATABASE_URL=postgresql://username:password@host:port/database
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -hex 32
```

### Step 5: Database Migration
After deployment, run database migrations:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Run migrations:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   npm run db:seed
   ```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/springz
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=springz
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 🔧 Environment Configuration

### Development
```env
NEXTAUTH_SECRET=dev-secret-key
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
CLOUDINARY_CLOUD_NAME=your-dev-cloud
CLOUDINARY_API_KEY=your-dev-key
CLOUDINARY_API_SECRET=your-dev-secret
```

### Production
```env
NEXTAUTH_SECRET=your-super-secure-secret-key
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@host:5432/db
CLOUDINARY_CLOUD_NAME=your-prod-cloud
CLOUDINARY_API_KEY=your-prod-key
CLOUDINARY_API_SECRET=your-prod-secret
```

## 📊 Database Migration

### From SQLite to PostgreSQL

1. **Export SQLite data:**
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

2. **Update DATABASE_URL:**
   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/db
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

## 🔒 Security Considerations

### Production Checklist
- [ ] Use strong NEXTAUTH_SECRET (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set secure database credentials
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates

### Environment Variables Security
- Never commit `.env` files
- Use environment-specific secrets
- Rotate secrets regularly
- Use secret management services

## 📈 Performance Optimization

### Vercel Optimizations
- Enable Vercel Analytics
- Configure Edge Functions for API routes
- Use Vercel's Image Optimization
- Enable Compression

### Database Optimizations
- Add database indexes for frequently queried fields
- Use connection pooling
- Monitor query performance
- Regular database maintenance

## 🚨 Monitoring & Logging

### Recommended Tools
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and error tracking
- **Uptime Robot**: Uptime monitoring

### Health Checks
Add a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  })
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database credentials
   - Ensure database is accessible

2. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

3. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches deployment URL
   - Ensure session configuration is correct

4. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper CORS configuration

### Support
For deployment issues:
- Check Vercel deployment logs
- Review application logs
- Contact support with specific error messages

---

**Happy Deploying! 🚀**

