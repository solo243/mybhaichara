export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // Protects your backend endpoints
          "/search", // Prevents SEO penalty from "Index Bloat" on search pages
          "/*?query=", // Blocks crawling of URL search parameters
          "/admin", // (Optional) Add this if you have a private admin dashboard
        ],
      },
      // You can also block specific bad bots if you want to save server bandwidth
      {
        userAgent: ["GPTBot", "CCBot", "anthropic-ai"],
        disallow: ["/"],
      },
    ],
    sitemap: "https://leaftv.fun/sitemap.xml",
  };
}
