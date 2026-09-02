import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomeSectionSelector from "@/components/HomeSectionSelector";

describe("HomeSectionSelector component", () => {
  it("renders both Explore and Leak Video category links", () => {
    render(<HomeSectionSelector />);

    const exploreLink = screen.getByRole("link", { name: /explore videos/i });
    expect(exploreLink).toBeInTheDocument();
    expect(exploreLink).toHaveAttribute("href", "/explore");

    const leakLink = screen.getByRole("link", { name: /leak video section/i });
    expect(leakLink).toBeInTheDocument();
    expect(leakLink).toHaveAttribute("href", "/mms");
  });
});
