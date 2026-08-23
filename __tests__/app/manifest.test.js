import { describe, it, expect } from "vitest";
import manifest from "@/app/manifest";

describe("manifest metadata generator", () => {
  it("returns a valid PWA web app manifest", () => {
    const data = manifest();

    expect(data.name).toContain("Leaftv");
    expect(data.short_name).toBe("Leaftv");
    expect(data.start_url).toBe("/");
    expect(data.display).toBe("standalone");
    expect(data.theme_color).toBe("#e50914");
    expect(data.icons.length).toBeGreaterThan(0);
  });
});
