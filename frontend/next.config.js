/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true
}

module.exports = nextConfig