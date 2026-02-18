import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "utfs.io",
      },
      {
        protocol: "http",
        hostname: "image.com",
      },
    ],
  },
};

export default nextConfig;
