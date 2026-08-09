/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.13", "0.0.0.0", "192.168.1.10"],
  images: {
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
