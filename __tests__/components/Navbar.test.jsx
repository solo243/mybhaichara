import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Navbar from "@/components/Navbar";
import * as navigation from "next/navigation";

describe("Navbar component", () => {
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

  it("renders the logo and brand title", () => {
    render(<Navbar />);
    expect(screen.getByText(/leaftv/i)).toBeInTheDocument();
  });

  it("renders desktop navigation links", () => {
    render(<Navbar />);
    expect(
      screen.getAllByRole("link", { name: /home/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /leak video/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /about/i }).length,
    ).toBeGreaterThan(0);
  });

  it("navigates on search submit with Enter key", () => {
    render(<Navbar />);

    const searchInputs = screen.getAllByPlaceholderText("search video...");
    const desktopSearch = searchInputs[0];

    fireEvent.change(desktopSearch, { target: { value: "funny clips" } });
    fireEvent.keyDown(desktopSearch, { key: "Enter", code: "Enter" });

    expect(pushMock).toHaveBeenCalledWith("/search?query=funny%20clips");
  });

  it("toggles mobile menu when toggle button is clicked", () => {
    render(<Navbar />);

    const menuToggle = screen.getByRole("button", { name: /toggle menu/i });
    expect(screen.queryByRole("list")).toBeInTheDocument();

    // Click to open mobile menu
    fireEvent.click(menuToggle);
    const searchInputs = screen.getAllByPlaceholderText("search video...");
    expect(searchInputs.length).toBe(2); // Desktop + Mobile
  });
});
