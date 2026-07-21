/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
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
    ],
  },
};

export default nextConfig;
