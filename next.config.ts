import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      }
    ],  
  },
  async rewrites() {
    return [
      {
        source: "/@:coordinates*",
        destination: "/[...coordinates]/@:coordinates*",
      },
    ];
  },
};

export default nextConfig;
