import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Card from "@/components/Card";

describe("Card component", () => {
  const sampleData = {
    _id: "650abc123def456",
    title: "Awesome Video Title! Test 123",
    img_url: "https://viralkand.com/preview.jpg",
    duration: "04:30",
    videoId: "VK-999",
  };

  it("renders card with title, duration, and videoId", () => {
    render(<Card data={sampleData} />);

    expect(
      screen.getByText("Awesome Video Title! Test 123"),
    ).toBeInTheDocument();
    expect(screen.getByText("04:30")).toBeInTheDocument();
    expect(screen.getByText("Post ID: #VK-999")).toBeInTheDocument();
  });

  it("renders the image when img_url is provided", () => {
    render(<Card data={sampleData} />);

    const img = screen.getByRole("img", {
      name: "Awesome Video Title! Test 123",
    });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("viralkand.com/preview.jpg"),
    );
  });

  it("renders fallback text when img_url is missing", () => {
    const dataWithoutImage = {
      _id: "650abc123def456",
      title: "No Image Post",
      img_url: "",
    };

    render(<Card data={dataWithoutImage} />);
    expect(screen.getByText("No preview available")).toBeInTheDocument();
  });

  it("formats link href with slugified title", () => {
    render(<Card data={sampleData} />);

    const link = screen.getByRole("link");
    // Slug for "Awesome Video Title! Test 123" is "awesome-video-title-test-123"
    expect(link).toHaveAttribute(
      "href",
      "/post/650abc123def456/awesome-video-title-test-123",
    );
  });

  it("handles missing/undefined data gracefully with default values", () => {
    render(<Card data={{ _id: "123" }} />);

    expect(screen.getByText("Title is not available")).toBeInTheDocument();
    expect(screen.getByText("Post ID: #NA")).toBeInTheDocument();
    expect(screen.getByText("No preview available")).toBeInTheDocument();
  });
});
