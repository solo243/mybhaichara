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
        disallow: ["/api/", "/search/", "/admin/", "/signin/", "/signup/"],
      },
      {
        userAgent: ["GPTBot", "CCBot", "anthropic-ai", "Bytespider"],
        disallow: "/",
      },
    ],

    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/video-sitemap.xml`,
    ],
  };
}
