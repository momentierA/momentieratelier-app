import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { nextRuntime }) => {
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        bufferutil: false,
        'utf-8-validate': false,
      }
    }
    return config
  },
};

export default nextConfig;
