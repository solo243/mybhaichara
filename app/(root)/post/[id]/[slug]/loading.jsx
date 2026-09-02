import React from "react";

export default function PostLoading() {
  return (
    <div className="min-h-screen bg-background md:pt-8 pb-10">
      <div className="mx-auto max-w-7xl">
        {/* Video Player Skeleton */}
        <div className="relative w-full aspect-video max-h-[80vh] bg-neutral-900 rounded-xl overflow-hidden shadow-2xl animate-pulse flex flex-col items-center justify-center border border-neutral-800/60">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full border-4 border-neutral-800 border-t-primary animate-spin" />
            <span className="text-sm font-medium text-neutral-400">
              Loading video...
            </span>
          </div>
        </div>

        {/* Title & Metadata Skeleton */}
        <div className="mt-6 max-md:px-2 flex flex-col gap-3 animate-pulse">
          <div className="h-8 bg-neutral-800 rounded-md w-3/4 max-w-xl" />
          <div className="h-5 bg-neutral-900 rounded-md w-1/4 max-w-xs" />
        </div>

        {/* Recommended Videos Grid Skeleton */}
        <div className="mt-12">
          <div className="h-7 bg-neutral-800 rounded-md w-56 mb-6 max-md:mx-2 animate-pulse" />

          <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="w-full flex flex-col overflow-hidden animate-pulse md:mb-4"
              >
                {/* Thumbnail Skeleton */}
                <div className="relative w-full md:h-47 h-50 bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800/40" />

                {/* Info Lines */}
                <div className="mt-2.5 max-md:px-2 flex flex-col gap-2">
                  <div className="h-4 bg-neutral-800 rounded w-full" />
                  <div className="h-3 bg-neutral-900 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
