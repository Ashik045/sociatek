/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images:{
    domains: ['res.cloudinary.com', 'www.pexels.com']
  }
}

module.exports = nextConfig
