/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jimowers.infy.uk",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.cssauthor.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: `https://jimowers.infy.uk/wp-admin`,
        permanent: true,
      },
    ];
  },
  experimental: {
    legacyBrowsers: false,
  },
};

module.exports = nextConfig; 