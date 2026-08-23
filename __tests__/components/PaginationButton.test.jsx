import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PaginationButtons from "@/components/PaginationButton";
import * as navigation from "next/navigation";

describe("PaginationButtons component", () => {
  const pushMock = vi.fn();
  const replaceMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(navigation, "useRouter").mockReturnValue({
      push: pushMock,
      replace: replaceMock,
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    });
    vi.spyOn(navigation, "usePathname").mockReturnValue("/posts");
    vi.spyOn(navigation, "useSearchParams").mockReturnValue(
      new URLSearchParams("query=comedy"),
    );
  });

  it("renders null if total_pages is 1 or less", () => {
    const { container } = render(
      <PaginationButtons page={1} total_pages={1} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders pagination with pages when total_pages > 1", () => {
    render(<PaginationButtons page={1} total_pages={5} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("navigates to the selected page preserving existing search params", () => {
    render(<PaginationButtons page={1} total_pages={5} />);

    // Find and click page 2 button
    const page2Button = screen.getByText("2");
    fireEvent.click(page2Button);

    expect(pushMock).toHaveBeenCalledWith("/posts?query=comedy&page=2");
  });

  it("handles mobile next and prev buttons", () => {
    render(<PaginationButtons page={2} total_pages={5} />);

    const nextButtons = screen.getAllByRole("button", { name: /next/i });
    const mobileNext = nextButtons[nextButtons.length - 1];
    fireEvent.click(mobileNext);

    expect(pushMock).toHaveBeenCalledWith("/posts?query=comedy&page=3");
  });

  it("disables mobile prev button on first page", () => {
    render(<PaginationButtons page={1} total_pages={5} />);

    const prevButtons = screen.getAllByRole("button", { name: /prev/i });
    const mobilePrev = prevButtons[prevButtons.length - 1];
    expect(mobilePrev).toBeDisabled();
  });
});
