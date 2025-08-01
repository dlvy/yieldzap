/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable static exports for better Netlify compatibility
  output: 'export',
  trailingSlash: true,
  // Configure domains for image optimization if needed
  images: {
    domains: [],
    unoptimized: true, // Required for static export
  },
  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },
}

module.exports = nextConfig