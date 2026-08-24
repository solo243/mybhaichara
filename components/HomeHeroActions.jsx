"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Share2, Check } from "lucide-react";
import { slugify } from "@/lib/utils";

const HomeHeroActions = ({ videos = [] }) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isSurprising, setIsSurprising] = useState(false);

  // 1. "Surprise Me" Action
  const handleSurpriseMe = () => {
    if (!videos || videos.length === 0) return;
    setIsSurprising(true);

    const randomIndex = Math.floor(Math.random() * videos.length);
    const randomVideo = videos[randomIndex];

    if (randomVideo?._id || randomVideo?.id) {
      const id = randomVideo._id || randomVideo.id;
      const slug = slugify(randomVideo.title || "video");
      router.push(`/post/${id}/${slug}`);
    } else {
      setIsSurprising(false);
    }
  };

  // 2. "Share Leaftv" Action
  const handleShareWebsite = async () => {
    const shareData = {
      title: "Leaftv - Free HD Video Streaming",
      text: "Watch exclusive and trending HD videos on Leaftv - 100% Free!",
      url:
        typeof window !== "undefined"
          ? window.location.origin
          : "https://leaftv.fun",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    // Fallback: Copy to Clipboard
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    }
  };

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3 select-none">
      {/* Surprise Me Button */}
      <button
        type="button"
        onClick={handleSurpriseMe}
        disabled={isSurprising}
        aria-label="Surprise me with a random video"
        className="group inline-flex items-center gap-2 px-5 py-2.5  bg-primary hover:bg-primary/90 text-text-primary text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-75"
      >
        <Sparkles
          className={`w-4 h-4 text-white transition-transform group-hover:rotate-12 ${
            isSurprising ? "animate-spin" : ""
          }`}
        />
        <span>{isSurprising ? "Finding video..." : "Surprise Me"}</span>
      </button>

      {/* Share Leaftv Button */}
      <button
        type="button"
        onClick={handleShareWebsite}
        aria-label="Share Leaftv website"
        className="inline-flex items-center gap-2 px-4 py-2.5  bg-surface hover:bg-surface-hover border border-border/80 text-text-secondary hover:text-text-primary text-sm font-medium transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in" />
            <span className="text-emerald-400 font-semibold">Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-primary" />
            <span>Share Leaftv</span>
          </>
        )}
      </button>
    </div>
  );
};

export default HomeHeroActions;
