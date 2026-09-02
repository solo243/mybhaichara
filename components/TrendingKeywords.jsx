import React from "react";
import Link from "next/link";
import { TrendingUp, Tag } from "lucide-react";

export const DEFAULT_TRENDING_TOPICS = [
  { label: "Desi Leaks", query: "desi", emoji: "" },
  { label: "Viral MMS", query: "mms", emoji: "" },
  { label: "Bhabhi Videos", query: "bhabhi", emoji: "" },
  // { label: "College Girlfriend", query: "gf", emoji: "" },
  { label: "1080p HD Clips", query: "hd", emoji: "" },
  { label: "Desi Models", query: "desi model", emoji: "" },
  { label: "Trending Reels", query: "reels", emoji: "" },
  { label: "Private MMS", query: "private mms", emoji: "" },
  { label: "Viral Scandals", query: "viral", emoji: "" },
  { label: "Full HD Leaks", query: "full hd", emoji: "" },
  { label: "Desi Romance", query: "romance", emoji: "" },
  { label: "Exclusive Clips", query: "exclusive", emoji: "" },
];

const TrendingKeywords = ({
  title = "Trending Searches & Popular Topics",
  description = "Explore popular categories and high-definition video collections on Leaftv.",
  topics = DEFAULT_TRENDING_TOPICS,
  className = "",
}) => {
  if (!topics || topics.length === 0) return null;

  return (
    <section
      aria-label={title}
      className={`w-full mt-22  px-4 my-4    backdrop-blur-md ${className}`}
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
        {topics.map((topic, index) => (
          <Link
            key={index}
            href={`/search?query=${encodeURIComponent(topic.query)}`}
            title={`Search videos for ${topic.label}`}
            className="group inline-flex items-center gap-1.5 px-3.5 py-1.5  bg-background hover:bg-neutral-800 border border-border/80 text-text-secondary hover:text-text-primary text-xs sm:text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:shadow-xs active:scale-95"
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
