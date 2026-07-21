/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.7"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "viralkand.com",
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
