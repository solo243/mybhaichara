import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Clean up DOM after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock window.scrollTo for jsdom
if (typeof window !== "undefined") {
  window.scrollTo = vi.fn();
}

// Mock next/navigation
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
  };
});
