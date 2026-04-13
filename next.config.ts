import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/myka-fonts/:path*",
        destination: "https://static.myka.com/fonts/:path*",
      },
    ];
  },
};

export default nextConfig;
