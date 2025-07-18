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
    ignoreBuildErrors: false,
  }
}
 
module.exports = nextConfig 