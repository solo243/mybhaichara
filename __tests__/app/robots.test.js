import { describe, it, expect, afterEach } from "vitest";
import robots from "@/app/robots";

describe("robots metadata generator", () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
  });

  it("returns correct crawl rules and multiple sitemap URLs", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const result = robots();

    expect(result.sitemap).toEqual([
      "https://leaftv.fun/sitemap.xml",
      "https://leaftv.fun/video-sitemap.xml",
    ]);
    expect(result.rules).toHaveLength(2);
    expect(result.rules[0]).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/search/", "/admin/", "/signin/", "/signup/"],
    });
    expect(result.rules[1]).toEqual({
      userAgent: ["GPTBot", "CCBot", "anthropic-ai", "Bytespider"],
      disallow: "/",
    });
  });

  it("uses custom NEXT_PUBLIC_SITE_URL when provided", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://custom-site.com/";

    const result = robots();

    expect(result.sitemap).toEqual([
      "https://custom-site.com/sitemap.xml",
      "https://custom-site.com/video-sitemap.xml",
    ]);
  });
});
