import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";

vi.mock("@/lib/mongooseConnect", () => ({
  connectDB: vi.fn().mockResolvedValue(true),
}));

describe("sitemap metadata generator", () => {
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

  it("returns static and dynamic routes from database", async () => {
    const sitemap = (await import("@/app/sitemap")).default;

    const mockVideos = [
      {
        _id: { toString: () => "post123" },
        title: "Test Video Title",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    mockCollection.toArray.mockResolvedValue(mockVideos);

    const routes = await sitemap();

    expect(routes.some((r) => r.url === "https://leaftv.fun")).toBe(true);
    expect(routes.some((r) => r.url === "https://leaftv.fun/about")).toBe(true);
    expect(
      routes.some(
        (r) => r.url === "https://leaftv.fun/post/post123/test-video-title",
      ),
    ).toBe(true);
  });

  it("returns static routes gracefully when database query fails", async () => {
    const sitemap = (await import("@/app/sitemap")).default;

    mockCollection.toArray.mockRejectedValue(new Error("DB connection failed"));

    const routes = await sitemap();

    expect(routes).toHaveLength(2);
    expect(routes[0].url).toBe("https://leaftv.fun");
    expect(routes[1].url).toBe("https://leaftv.fun/about");
  });
});
