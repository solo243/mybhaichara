import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock video fetchers
vi.mock("@/lib/FetchVideo", () => ({
  getRandomHomeVideos: vi.fn().mockResolvedValue([
    { _id: "rec1", id: "rec1", title: "Recommended Video 1", videoId: "101" },
    { _id: "rec2", id: "rec2", title: "Recommended Video 2", videoId: "102" },
  ]),
  getVideoPage: vi.fn().mockResolvedValue({ fetchedVideos: [] }),
}));

describe("NotFound 404 page", () => {
  it("renders 404 hero text, home/search action buttons, and recommendation cards", async () => {
    const NotFound = (await import("@/app/not-found")).default;
    const jsx = await NotFound();

    render(jsx);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/Lost in Stream\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to home/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /search videos/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Recommended For You")).toBeInTheDocument();
    expect(screen.getByText("Recommended Video 1")).toBeInTheDocument();
    expect(screen.getByText("Recommended Video 2")).toBeInTheDocument();
  });
});
