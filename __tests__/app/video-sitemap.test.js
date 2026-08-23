import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";

vi.mock("@/lib/mongooseConnect", () => ({
  connectDB: vi.fn().mockResolvedValue(true),
}));

describe("Google Video Sitemap Route Handler (/video-sitemap.xml)", () => {
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      toArray: vi.fn(),
    };

    mongoose.connection.db = {
      collection: vi.fn().mockReturnValue(mockCollection),
    };
  });

  it("generates valid Google Video XML sitemap containing <video:video> tags", async () => {
    const { GET } = await import("@/app/video-sitemap.xml/route");

    const mockVideos = [
      {
        _id: { toString: () => "vid-123" },
        title: "Exciting Action Movie",
        img_url: "https://viralkand.com/thumb1.jpg",
        duration: "05:30",
        videos: ["https://vk25cdn.viralkand.com/action.mp4"],
        createdAt: "2026-01-01T10:00:00.000Z",
      },
    ];
    mockCollection.toArray.mockResolvedValue(mockVideos);

    const response = await GET();
    const xml = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("application/xml");
    expect(xml).toContain("<urlset");
    expect(xml).toContain(
      'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"',
    );
    expect(xml).toContain(
      "<loc>https://leaftv.fun/post/vid-123/exciting-action-movie</loc>",
    );
    expect(xml).toContain(
      "<video:thumbnail_loc>https://viralkand.com/thumb1.jpg</video:thumbnail_loc>",
    );
    expect(xml).toContain(
      "<video:title><![CDATA[Exciting Action Movie]]></video:title>",
    );
    expect(xml).toContain(
      "<video:content_loc>https://vk25cdn.viralkand.com/action.mp4</video:content_loc>",
    );
    expect(xml).toContain("<video:duration>330</video:duration>");
  });

  it("returns empty urlset gracefully if database fails", async () => {
    const { GET } = await import("@/app/video-sitemap.xml/route");

    mockCollection.toArray.mockRejectedValue(new Error("DB Down"));

    const response = await GET();
    const xml = await response.text();

    expect(response.status).toBe(200);
    expect(xml).toContain("<urlset");
  });
});
