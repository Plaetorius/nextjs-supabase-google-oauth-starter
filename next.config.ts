import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  allowedDevOrigins: ['localhost']
};

export default nextConfig;
