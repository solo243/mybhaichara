export default function robots() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://leaftv.fun").replace(
    /\/$/,
    "",
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
    ],

    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/video-sitemap.xml`,
    ],
  };
}
