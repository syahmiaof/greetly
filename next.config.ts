import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/greetly.web/index.html',
      },
    ];
  },
};

export default nextConfig;
