import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ShareButton from "@/components/ShareButton";

describe("ShareButton component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the share button correctly", () => {
    render(<ShareButton />);
    expect(screen.getByRole("button", { name: /share/i })).toBeInTheDocument();
  });

  it("uses navigator.share when available", async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      value: shareMock,
      writable: true,
      configurable: true,
    });

    render(<ShareButton title="Test Video" url="https://leaftv.fun/post/1" />);

    const button = screen.getByRole("button", { name: /share/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(shareMock).toHaveBeenCalledWith({
      title: "Test Video",
      text: "Test Video",
      url: "https://leaftv.fun/post/1",
    });
  });

  it("copies current URL using clipboard API when navigator.share is unavailable", async () => {
    Object.defineProperty(navigator, "share", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window, "isSecureContext", {
      value: true,
      writable: true,
    });
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    render(<ShareButton />);

    const button = screen.getByRole("button", { name: /share/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(writeTextMock).toHaveBeenCalledWith(window.location.href);
    expect(screen.getByText("Link copied!")).toBeInTheDocument();
    expect(screen.getByText("Copied!")).toBeInTheDocument();

    // After 3 seconds, the alert message disappears
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText("Link copied!")).not.toBeInTheDocument();
  });

  it("uses fallback textarea copy when navigator.clipboard is unavailable", async () => {
    Object.defineProperty(navigator, "share", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "isSecureContext", {
      value: false,
      writable: true,
    });
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const execCommandMock = vi.fn();
    document.execCommand = execCommandMock;

    render(<ShareButton />);

    const button = screen.getByRole("button", { name: /share/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(execCommandMock).toHaveBeenCalledWith("copy");
    expect(screen.getByText("Link copied!")).toBeInTheDocument();
  });
});
