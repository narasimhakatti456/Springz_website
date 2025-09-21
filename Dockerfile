# Multi-stage Dockerfile for Next.js 15
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy dependency files AND prisma schema BEFORE installing
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies - use npm install instead of ci for better compatibility
RUN npm install --legacy-peer-deps --omit=dev && \
    npm cache clean --force

# Separate stage for dev dependencies needed for build
FROM base AS dev-deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files AND prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies including dev
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy dependencies from dev-deps stage
COPY --from=dev-deps /app/node_modules ./node_modules
COPY --from=dev-deps /app/prisma ./prisma

# Copy all source files
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1

# Generate Prisma client (in case postinstall didn't run)
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image
FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Create public directory (Next.js apps typically have one)
RUN mkdir -p ./public

# Check if standalone directory exists and copy accordingly
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone* ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# If standalone wasn't created, copy the full .next directory and dependencies
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Check if server.js exists (standalone build), otherwise use npm start
CMD ["sh", "-c", "if [ -f server.js ]; then node server.js; else npm start; fi"]