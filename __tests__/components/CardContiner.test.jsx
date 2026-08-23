import React from "react";
import { render, screen } from "@testing-library/react";
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
    expect(screen.getAllByText(/Post ID: #/)).toHaveLength(3);
  });
});
