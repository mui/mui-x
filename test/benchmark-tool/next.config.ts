import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React profiling in production builds
  reactProductionProfiling: true,
  productionBrowserSourceMaps: true,
};

export default nextConfig;
