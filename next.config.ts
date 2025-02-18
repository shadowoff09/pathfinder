import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["flagcdn.com"],
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
