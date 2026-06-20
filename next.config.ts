import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  typedRoutes: true,
  async rewrites() {
    return [{ source: "/resume", destination: "/resume.pdf" }];
  },
};

export default withBundleAnalyzer(nextConfig);
