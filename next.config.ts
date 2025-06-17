import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `gvr.ltm.temporary.site/mower/`,
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: `https://gvr.ltm.temporary.site/mower/wp-admin`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
