/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "leaftv.fun", // Matches non-www traffic
          },
        ],
        destination: "https://www.leaftv.fun/:path*", // Redirects to www
        permanent: true, // 301 Permanent Redirect for SEO
      },
    ];
  },

  devIndicators: false,
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.13", "0.0.0.0", "192.168.1.10"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "viralkand.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "**",
      },
      // Added your new CDN domain here
      {
        protocol: "https",
        hostname: "vk25cdn.viralkand.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
