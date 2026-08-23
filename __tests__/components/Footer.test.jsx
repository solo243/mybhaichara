import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "@/components/Footer";

describe("Footer component", () => {
  it("renders brand logo link and copyright information", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /leaftv/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /© \d{4} Leaftv\. All rights reserved\./i }),
    ).toBeInTheDocument();
  });
});
