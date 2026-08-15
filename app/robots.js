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
        disallow: ["/api/", "/search/", "/admin/"],
      },
      {
        userAgent: ["GPTBot", "CCBot", "anthropic-ai"],
        disallow: "/",
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
