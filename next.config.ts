import type { NextConfig } from "next";
/** @type {*} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      }
    ]
  },
};

export default nextConfig;
