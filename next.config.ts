import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  typedRoutes: true,
  async rewrites() {
    return [{ source: "/resume", destination: "/resume.pdf" }];
  },
};

export default nextConfig;
