import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React profiling in production builds
  reactProductionProfiling: true,
  productionBrowserSourceMaps: true,
  experimental: {
    turbopackMinify: false,
    // Enable filesystem caching for `next build`
    turbopackFileSystemCacheForBuild: true,
  },
};

export default nextConfig;
