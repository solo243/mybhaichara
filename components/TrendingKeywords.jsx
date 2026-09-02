import React from "react";
import Link from "next/link";
import { TrendingUp, Tag } from "lucide-react";

export const DEFAULT_TRENDING_TOPICS = [
  { label: "Desi Leaks", query: "desi", emoji: "" },
  { label: "Viral MMS", query: "mms", emoji: "" },
  { label: "Bhabhi Videos", query: "bhabhi", emoji: "" },
  { label: "College Girlfriend", query: "girlfriend", emoji: "" },
  { label: "1080p HD Clips", query: "hd", emoji: "" },
  { label: "Desi Models", query: "model", emoji: "" },
  { label: "Trending Reels", query: "reels", emoji: "" },
  { label: "Private MMS", query: "private", emoji: "" },
  { label: "Viral Scandals", query: "viral", emoji: "" },
  { label: "Full HD Leaks", query: "leaks", emoji: "" },
  { label: "Desi Romance", query: "romance", emoji: "" },
  { label: "Exclusive Clips", query: "exclusive", emoji: "" },
];

const STOP_WORDS = new Set([
  "the",
  "and",
  "with",
  "for",
  "from",
  "that",
  "this",
  "watch",
  "view",
  "post",
  "free",
  "online",
  "full",
  "video",
  "videos",
  "clips",
  "clip",
  "part",
  "best",
  "new",
  "all",
  "are",
  "was",
  "has",
  "have",
  "not",
  "out",
]);

// Helper to extract top keywords directly from video titles
export function extractKeywordsFromVideos(videos = [], limit = 12) {
  if (!Array.isArray(videos) || videos.length === 0) return [];

  const wordCounts = new Map();

  for (const item of videos) {
    const title = (item?.title || "").toLowerCase();
    // Split by non-alphanumeric
    const words = title.split(/[^a-z0-9]+/);
    for (const w of words) {
      if (w.length >= 3 && !STOP_WORDS.has(w) && isNaN(w)) {
        wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
      }
    }
  }

  // Sort by frequency
  const sorted = Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  return sorted.map(([word]) => ({
    label: word.charAt(0).toUpperCase() + word.slice(1),
    query: word,
    emoji: "",
  }));
}

const TrendingKeywords = ({
  title = "Trending Searches & Popular Topics",
  description = "Explore popular categories and high-definition video collections on Leaftv.",
  topics = null,
  videos = [],
  className = "",
}) => {
  let displayTopics = topics;

  // If no manual topics provided but videos are passed, extract directly from titles
  if (!displayTopics) {
    const extracted = extractKeywordsFromVideos(videos);
    displayTopics = extracted.length >= 4 ? extracted : DEFAULT_TRENDING_TOPICS;
  }

  if (!displayTopics || displayTopics.length === 0) return null;

  return (
    <section
      aria-label={title}
      className={`w-full mt-12 px-4 my-4 backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
          {title}
        </h2>
      </div>

      {description && (
        <p className="text-xs sm:text-sm text-neutral-400 mb-4 leading-relaxed">
          {description}
        </p>
      )}

      {/* Semantic Keyword Anchor Tags */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {displayTopics.map((topic, index) => (
          <Link
            key={index}
            href={`/search?query=${encodeURIComponent(topic.query)}`}
            title={`Search videos for ${topic.label}`}
            className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-background hover:bg-neutral-800 border border-border/80 text-text-secondary hover:text-text-primary text-xs sm:text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:shadow-xs active:scale-95"
          >
            {topic.emoji ? (
              <span className="text-xs leading-none">{topic.emoji}</span>
            ) : (
              <Tag className="w-3.5 h-3.5 text-text-secondary group-hover:text-primary transition-colors" />
            )}
            <span>{topic.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TrendingKeywords;
