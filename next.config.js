/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com']
  }
}

module.exports = nextConfig
