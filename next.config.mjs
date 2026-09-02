/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      underscore: "lodash",
    },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.leaftv.fun" }],
        destination: "https://leaftv.fun/:path*",
        permanent: true,
      },
      {
        source: "/leak",
        destination: "/mms",
        permanent: true,
      },
      {
        source: "/leaks",
        destination: "/mms",
        permanent: true,
      },
    ];
  },
  // output: "standalone",
  // output: "export",
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
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
        hostname: "vk25cdn.viralkand.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "xxxtv.top",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
