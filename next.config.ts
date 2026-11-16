import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The QR card renderer reads these fonts at runtime and uses a native module.
  serverExternalPackages: ["@resvg/resvg-js", "opentype.js"],
  outputFileTracingIncludes: {
    "/api/admin/qr": ["./src/assets/fonts/**"],
    "/admin/coupons": ["./src/assets/fonts/**"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
