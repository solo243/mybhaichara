import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";

// Mock database connection helper
vi.mock("@/lib/mongooseConnect", () => ({
  connectDB: vi.fn().mockResolvedValue(true),
}));

describe("GET /api/home Route Handler", () => {
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      findOne: vi.fn(),
      find: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      toArray: vi.fn(),
      countDocuments: vi.fn(),
    };

    mongoose.connection.db = {
      collection: vi.fn().mockReturnValue(mockCollection),
    };
  });

  it("returns a single video when 'videos' param is supplied", async () => {
    const { GET } = await import("@/app/api/home/route");

    const fakeVideo = {
      _id: { toString: () => "650abc123" },
      title: "Solo Video",
    };
    mockCollection.findOne.mockResolvedValue(fakeVideo);

    const request = new Request("https://localhost/api/home?videos=650abc123");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.video.title).toBe("Solo Video");
    expect(body.video._id).toBe("650abc123");
  });

  it("returns search results when 'query' param is supplied", async () => {
    const { GET } = await import("@/app/api/home/route");

    const fakeVideos = [
      { _id: { toString: () => "vid1" }, title: "React Tutorial" },
    ];
    mockCollection.toArray.mockResolvedValue(fakeVideos);

    const request = new Request("https://localhost/api/home?query=React");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].title).toBe("React Tutorial");
    expect(body.pagination.totalItems).toBe(1);
  });

  it("returns paginated videos when no search or video ID is specified", async () => {
    const { GET } = await import("@/app/api/home/route");

    const fakeVideos = [
      { _id: { toString: () => "vid1" }, title: "Video 1" },
      { _id: { toString: () => "vid2" }, title: "Video 2" },
    ];
    mockCollection.toArray.mockResolvedValue(fakeVideos);
    mockCollection.countDocuments.mockResolvedValue(20);

    const request = new Request("https://localhost/api/home?page=1&limit=2");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(2);
    expect(body.pagination.totalPages).toBe(10);
    expect(body.pagination.currentPage).toBe(1);
  });
});
