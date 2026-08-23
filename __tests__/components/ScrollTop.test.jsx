import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ScrollToTop from "@/components/ScrollTop";

describe("ScrollToTop component", () => {
  it("calls window.scrollTo with top: 0, left: 0 on render", () => {
    window.scrollTo = vi.fn();

    render(<ScrollToTop />);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  });
});
