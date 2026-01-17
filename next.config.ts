import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow warnings during development
    ignoreDuringBuilds: true,
  },
  /* config options here */
};

export default nextConfig;
