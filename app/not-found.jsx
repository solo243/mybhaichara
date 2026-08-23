import React from "react";
import Link from "next/link";
import { Home, Search, Compass, PlayCircle } from "lucide-react";
import CardContiner from "@/components/CardContiner";
import { getRandomHomeVideos, getVideoPage } from "@/lib/FetchVideo";

export const metadata = {
  title: "404 - Page Not Found",
  description:
    "The page or video you are looking for was not found. Browse recommended and trending videos on Leaftv.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function NotFound() {
  // Fetch recommended/trending videos to keep user engaged
  let recommendedVideos = [];

  try {
    recommendedVideos = await getRandomHomeVideos(8);
    if (!recommendedVideos || recommendedVideos.length === 0) {
      const fallback = await getVideoPage({ page: 1, limit: 8 });
      recommendedVideos = fallback.fetchedVideos || [];
    }
  } catch (error) {
    console.error("Failed to load 404 recommendations:", error);
  }

  return (
    <div className="min-h-[85vh] w-full flex flex-col items-center justify-start pt-10 pb-20 px-4">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
        {/* 404 Hero Banner */}
        <div className="w-full max-w-2xl text-center py-10 flex flex-col items-center">
          {/* Glowing 404 Display */}
          <div className="relative mb-6">
            <span className="text-8xl md:text-9xl font-extrabold tracking-tighter text-neutral-800 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-black bg-linear-to-r from-primary via-orange-500 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
                Lost in Stream?
              </span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
            Oops! This page or video doesn&apos;t exist.
          </h1>

          <p className="text-neutral-400 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
            The link you followed may be broken, or the video might have been
            removed. Don&apos;t worry, there&apos;s plenty more to watch!
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-red-700 text-text-primary rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/search"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-surface hover:bg-surface-hover border border-border hover:border-text-secondary text-text-primary rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Search size={18} className="text-text-secondary" />
              <span>Search Videos</span>
            </Link>
          </div>
        </div>

        {/* Recommended Videos Section */}
        {recommendedVideos && recommendedVideos.length > 0 && (
          <div className="w-full mt-12 pt-10 border-t border-border/40">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-6 h-6 text-primary" />
                <h2 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
                  Recommended For You
                </h2>
              </div>

              <Link
                href="/"
                className="text-xs sm:text-sm font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
              >
                <Compass size={16} />
                <span>Explore All</span>
              </Link>
            </div>

            <CardContiner data={recommendedVideos} />
          </div>
        )}
      </div>
    </div>
  );
}
