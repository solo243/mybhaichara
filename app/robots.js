export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/search/", "/admin/"],
      },
      {
        userAgent: ["GPTBot", "CCBot", "anthropic-ai"],
        disallow: ["/"],
      },
    ],
    sitemap: "https://www.leaftv.fun/sitemap.xml",
  };
}
