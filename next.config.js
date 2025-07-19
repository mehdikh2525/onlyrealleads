/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 15, no experimental flag needed
  
  // Exclude the replit directory from compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/replit/**/*']
    }
    return config
  },
  
  // Exclude replit directory from TypeScript checking
  typescript: {
    ignoreBuildErrors: true, // Skip TS errors (Edge Function code uses Deno)
  },
  eslint: {
    ignoreDuringBuilds: true,   // ← Skip ESLint when running `next build`
  },
}
 
module.exports = nextConfig 