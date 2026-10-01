import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Never use standalone on Vercel to avoid the next-server.js.nft.json ENOENT error
  output: process.env.VERCEL ? undefined : (process.env.BUILD_STANDALONE ? "standalone" : undefined),
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai"],
  images: {
    qualities: [72, 75, 78, 80],
  },
};

export default nextConfig;
