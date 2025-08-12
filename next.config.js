/** @type {import('next').NextConfig} */
const nextConfig = {
  // CORS headers for API access
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },

  // Optimize for Vercel deployment
  output: 'standalone',

  // Ensure environment variables work properly
  env: {
    NEXT_PUBLIC_LUNARCRUSH_API_KEY: process.env.NEXT_PUBLIC_LUNARCRUSH_API_KEY,
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },

  // Production optimizations
  poweredByHeader: false,
  compress: true,

  // Vercel-specific settings
  trailingSlash: false,

  // Ensure TypeScript builds properly
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration for deployment
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
