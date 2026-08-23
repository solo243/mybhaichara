import { describe, it, expect } from "vitest";
import { slugify, parseIsoDuration, escapeRegex } from "@/lib/utils";

describe("lib/utils utilities", () => {
  describe("slugify", () => {
    it("converts spaces, uppercase letters, and special chars into clean slugs", () => {
      expect(slugify("Hello World! 123")).toBe("hello-world-123");
      expect(slugify("  ---Super Video--- ")).toBe("super-video");
      expect(slugify("")).toBe("video");
      expect(slugify(null)).toBe("video");
    });
  });

  describe("parseIsoDuration", () => {
    it("converts MM:SS format to ISO 8601 duration", () => {
      expect(parseIsoDuration("04:30")).toBe("PT4M30S");
      expect(parseIsoDuration("12:05")).toBe("PT12M5S");
    });

    it("converts HH:MM:SS format to ISO 8601 duration", () => {
      expect(parseIsoDuration("01:25:30")).toBe("PT1H25M30S");
    });

    it("returns undefined for invalid durations", () => {
      expect(parseIsoDuration(null)).toBeUndefined();
      expect(parseIsoDuration("invalid")).toBeUndefined();
    });
  });

  describe("escapeRegex", () => {
    it("escapes special regular expression characters", () => {
      expect(escapeRegex("video (clip) [1080p]*+?")).toBe(
        "video \\(clip\\) \\[1080p\\]\\*\\+\\?",
      );
      expect(escapeRegex("hello.world$")).toBe("hello\\.world\\$");
    });
  });
});
