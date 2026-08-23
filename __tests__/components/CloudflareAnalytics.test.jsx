import React from "react";
import { render, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import CloudflareAnalytics from "@/components/CloudflareAnalytics";

describe("CloudflareAnalytics component", () => {
  const originalEnv = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

  beforeEach(() => {
    cleanup();
    document.head.innerHTML = "";
    document.body.innerHTML = "";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = originalEnv;
    cleanup();
    document.head.innerHTML = "";
    document.body.innerHTML = "";
  });

  it("renders nothing when no token is provided or configured", () => {
    delete process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
    const { container } = render(<CloudflareAnalytics />);
    expect(container.firstChild).toBeNull();
    expect(document.getElementById("cloudflare-web-analytics")).toBeNull();
  });

  it("renders Cloudflare beacon script with proper attributes when token prop is provided", () => {
    render(<CloudflareAnalytics token="cf-test-token-123" />);
    const script = document.querySelector(
      "script[src='https://static.cloudflareinsights.com/beacon.min.js']",
    );
    expect(script).not.toBeNull();
    expect(script.getAttribute("data-cf-beacon")).toBe(
      JSON.stringify({ token: "cf-test-token-123" }),
    );
  });
});
