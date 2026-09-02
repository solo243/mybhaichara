import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CardContiner from "@/components/CardContiner";

describe("CardContiner component", () => {
  it("renders a grid of Card components for each item in data", () => {
    const mockData = [
      { _id: "1", id: "item1", title: "Video One", videoId: "101" },
      { _id: "2", id: "item2", title: "Video Two", videoId: "102" },
      { _id: "3", id: "item3", title: "Video Three", videoId: "103" },
    ];

    render(<CardContiner data={mockData} />);

    expect(screen.getByText("Video One")).toBeInTheDocument();
    expect(screen.getByText("Video Two")).toBeInTheDocument();
    expect(screen.getByText("Video Three")).toBeInTheDocument();
    expect(screen.getAllByText(/ID: #/)).toHaveLength(3);
  });

  it("toggles density between default (2 on mobile, 4 on PC) and alternate (1 on mobile, 5 on PC)", () => {
    const mockData = [
      { _id: "1", id: "item1", title: "Video One", videoId: "101" },
    ];

    render(<CardContiner data={mockData} />);

    const toggleBtn = screen.getByRole("button", {
      name: /Switch to 1 per row/i,
    });
    expect(toggleBtn).toBeInTheDocument();

    // Click to switch to alternate mode
    fireEvent.click(toggleBtn);
    expect(
      screen.getByRole("button", { name: /Switch to 2 per row/i }),
    ).toBeInTheDocument();
  });
});
