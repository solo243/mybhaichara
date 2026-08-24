import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomeHeroActions from "@/components/HomeHeroActions";
import * as navigation from "next/navigation";

describe("HomeHeroActions component", () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(navigation, "useRouter").mockReturnValue({
      push: pushMock,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    });
  });

  it("renders Surprise Me and Share Leaftv buttons", () => {
    render(<HomeHeroActions videos={[{ _id: "1", title: "Test Video" }]} />);

    expect(
      screen.getByRole("button", { name: /Surprise me with a random video/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Share Leaftv website/i }),
    ).toBeInTheDocument();
  });

  it("navigates to a random video when Surprise Me is clicked", () => {
    const mockVideos = [{ _id: "vid123", title: "Amazing Clip" }];

    render(<HomeHeroActions videos={mockVideos} />);

    const surpriseBtn = screen.getByRole("button", {
      name: /Surprise me with a random video/i,
    });
    fireEvent.click(surpriseBtn);

    expect(pushMock).toHaveBeenCalledWith("/post/vid123/amazing-clip");
  });

  it("handles Share Leaftv clipboard copy when navigator.share is unavailable", async () => {
    const writeTextMock = vi.fn().mockResolvedValue();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<HomeHeroActions videos={[]} />);

    const shareBtn = screen.getByRole("button", {
      name: /Share Leaftv website/i,
    });
    fireEvent.click(shareBtn);

    expect(writeTextMock).toHaveBeenCalled();
  });
});
