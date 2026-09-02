import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TrendingKeywords, {
  DEFAULT_TRENDING_TOPICS,
} from "@/components/TrendingKeywords";

describe("TrendingKeywords component", () => {
  it("renders default title and description", () => {
    render(<TrendingKeywords />);

    expect(
      screen.getByText("Trending Searches & Popular Topics"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Explore popular categories and high-definition video collections on Leaftv.",
      ),
    ).toBeInTheDocument();
  });

  it("renders all topic links with correct href attributes", () => {
    render(<TrendingKeywords />);

    DEFAULT_TRENDING_TOPICS.forEach((topic) => {
      const link = screen.getByRole("link", {
        name: new RegExp(topic.label, "i"),
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        "href",
        `/search?query=${encodeURIComponent(topic.query)}`,
      );
    });
  });

  it("renders custom title and custom topics", () => {
    const customTopics = [
      { label: "Custom Topic 1", query: "topic1", emoji: "🔥" },
      { label: "Custom Topic 2", query: "topic2" },
    ];

    render(
      <TrendingKeywords
        title="Custom Header"
        description="Custom Subtitle"
        topics={customTopics}
      />,
    );

    expect(screen.getByText("Custom Header")).toBeInTheDocument();
    expect(screen.getByText("Custom Subtitle")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Custom Topic 1/i }),
    ).toHaveAttribute("href", "/search?query=topic1");
    expect(
      screen.getByRole("link", { name: /Custom Topic 2/i }),
    ).toHaveAttribute("href", "/search?query=topic2");
  });
});
