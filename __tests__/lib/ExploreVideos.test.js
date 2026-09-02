import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ExploreVideos,
  ExploreVideo,
  getVideoById,
  getRecommendedVideos,
  formatDurationSeconds,
  normalizeApiVideo,
} from "@/lib/FetchVideo";

// Mock next/cache
vi.mock("next/cache", () => ({
  unstable_cache: (fn) => fn,
}));

// Mock mongoose
vi.mock("@/lib/mongooseConnect", () => ({
  connectDB: vi.fn().mockResolvedValue(true),
}));

describe("ExploreVideos functionality", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("formats seconds to proper duration strings", () => {
    expect(formatDurationSeconds(65)).toBe("1:05");
    expect(formatDurationSeconds(643)).toBe("10:43");
    expect(formatDurationSeconds(3665)).toBe("1:01:05");
    expect(formatDurationSeconds("NA")).toBe("NA");
  });

  it("normalizes API video structure correctly", () => {
    const rawItem = {
      id: "test1234",
      title: "Sample Video Title",
      description: "Sample Description",
      slug: "sample_video_title",
      duration: 520,
      views: 150,
      thumbnail: "https://xxxtv.top/videos/test/thumb.jpeg",
      preview: "https://xxxtv.top/videos/test/preview.mp4",
      embedUrl: "https://xxxtv.top/embed/test1234",
      pageUrl: "https://xxxtv.top/video/test1234/sample",
    };

    const normalized = normalizeApiVideo(rawItem);

    expect(normalized._id).toBe("test1234");
    expect(normalized.videoId).toBe("test1234");
    expect(normalized.title).toBe("Sample Video Title");
    expect(normalized.img_url).toBe("https://xxxtv.top/videos/test/thumb.jpeg");
    expect(normalized.duration).toBe("8:40");
    expect(normalized.isExplore).toBe(true);
    expect(normalized.source).toBe("explore");
    expect(normalized.videos).toEqual([
      "https://xxxtv.top/videos/test/preview.mp4",
    ]);
  });

  it("fetches and parses data from xxxtv.top API", async () => {
    const mockApiResponse = {
      success: true,
      page: 1,
      limit: 2,
      totalPages: 10,
      totalVideos: 20,
      data: [
        {
          id: "vid1",
          title: "Video 1",
          duration: 300,
          thumbnail: "https://xxxtv.top/1.jpeg",
          preview: "https://xxxtv.top/1.mp4",
        },
      ],
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    const result = await ExploreVideos({ page: 1, limit: 2 });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://xxxtv.top/api/videos/latest?page=1&limit=2",
      expect.objectContaining({ next: { revalidate: 300 } }),
    );
    expect(result.fetchedVideos).toHaveLength(1);
    expect(result.fetchedVideos[0].title).toBe("Video 1");
    expect(result.totalPages).toBe(10);
    expect(ExploreVideo).toBe(ExploreVideos);
  });

  it("fetches single video by ID from external API when not in DB", async () => {
    const mockSingleVideo = {
      success: true,
      data: {
        id: "uZnYtJ7O8q",
        title: "StepSis Ride",
        duration: 600,
        thumbnail: "https://xxxtv.top/thumb.jpeg",
        preview: "https://xxxtv.top/preview.mp4",
        embedUrl: "https://xxxtv.top/embed/uZnYtJ7O8q",
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockSingleVideo,
    });

    const video = await getVideoById("uZnYtJ7O8q");

    expect(video).not.toBeNull();
    expect(video.title).toBe("StepSis Ride");
    expect(video.videoId).toBe("uZnYtJ7O8q");
    expect(video.isExplore).toBe(true);
    expect(video.videos).toContain("https://xxxtv.top/preview.mp4");
  });

  it("suggests strictly Explore videos when isExplore is true", async () => {
    const mockApiResponse = {
      success: true,
      page: 1,
      limit: 6,
      totalPages: 10,
      totalVideos: 20,
      data: [
        {
          id: "current123",
          title: "Current Video",
          duration: 300,
          thumbnail: "https://xxxtv.top/thumb1.jpeg",
          preview: "https://xxxtv.top/prev1.mp4",
        },
        {
          id: "exploreRec1",
          title: "Explore Recommended 1",
          duration: 400,
          thumbnail: "https://xxxtv.top/thumb2.jpeg",
          preview: "https://xxxtv.top/prev2.mp4",
        },
      ],
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    const recs = await getRecommendedVideos("current123", 4, true);

    expect(recs.length).toBe(1);
    expect(recs[0].id).toBe("exploreRec1");
    expect(recs[0].isExplore).toBe(true);
    expect(recs[0].preview).toBe("https://xxxtv.top/prev2.mp4");
  });
});
