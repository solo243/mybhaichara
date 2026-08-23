import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

describe("Static Sitemaps (public/sitemap.xml and public/video-sitemap.xml)", () => {
  it("verifies public/sitemap.xml exists and contains valid XML structure", () => {
    const sitemapPath = path.resolve("./public/sitemap.xml");
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const content = fs.readFileSync(sitemapPath, "utf8");
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(content).toContain("<loc>https://leaftv.fun</loc>");
    expect(content).toContain("</urlset>");
  });

  it("verifies public/video-sitemap.xml exists and contains Google Video XML tags", () => {
    const videoSitemapPath = path.resolve("./public/video-sitemap.xml");
    expect(fs.existsSync(videoSitemapPath)).toBe(true);

    const content = fs.readFileSync(videoSitemapPath, "utf8");
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"');
    expect(content).toContain("<video:thumbnail_loc>");
    expect(content).toContain("<video:title>");
    expect(content).toContain("</urlset>");
  });
});
