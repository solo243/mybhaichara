"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// 1. Import the official Plyr CSS for beautiful default custom controls
import "plyr/dist/plyr.css";

import ShareButton from "./ShareButton";

// 2. Next.js App Router requires custom video players to be dynamically imported 
// so they don't break Server-Side Rendering (SSR) by looking for the 'document' object.
const PlyrPlayer = dynamic(
  () => import("plyr-react").then((mod) => mod.Plyr || mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-neutral-900">
        
        <span className="text-neutral-500 font-medium animate-pulse">Loading Player...</span>
      </div>
    )
  }
);

const VideoPlayer = ({ videos, title, children }) => {
  const [activeUrl, setActiveUrl] = useState(videos?.[0] || "");

  if (!activeUrl) {
    return (
      <div className="flex items-center justify-center w-full aspect-video bg-neutral-900 rounded-xl border border-neutral-800">
        <p className="text-neutral-500 font-medium">Video file not found.</p>
      </div>
    );
  }

  // 3. Configure the exact custom controls you want
  const plyrOptions = {
    controls: [
      "play-large",   // The large play button in the center
      "play",         // Play/pause playback
      "progress",     // The timeline scrubber
      "current-time", // The current time of playback
      "mute",         // Toggle mute
      "volume",       // Volume slider
      "settings",     // Settings menu (speed, quality)
      "pip",          // Picture-in-picture mode
      "fullscreen",   // Toggle fullscreen
    ],
  };

  const plyrSource = {
    type: "video",
    title: title,
    sources: [
      {
        src: activeUrl,
        type: "video/mp4", 
      },
    ],
  };

  return (
    <div className="w-full flex flex-col">
      
      {/* 
        Player Container 
        The Tailwind classes `[&_.plyr]:h-full [&_.plyr]:w-full` ensure 
        the custom player perfectly stretches to fill our responsive wrapper, 
        automatically handling both horizontal and vertical videos cleanly.
      */}
      <div className="relative w-full aspect-video max-h-[80vh] bg-black rounded-xl overflow-hidden shadow-2xl  [&_.plyr]:h-full [&_.plyr]:w-full">
        <PlyrPlayer source={plyrSource} options={plyrOptions} />
      </div>

      {/* Metadata and Controls Layout */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4  md:px-0">
        {/* Left Side: Title and Children (Passed from PostPage) */}
        <div className="flex-1 w-full">
          {children}
        </div>

        {/* Right Side: Actions and Source selection */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 lg:w-[40%]">
          
          {/* Action Buttons */}
          <div className="flex items-center gap-6 w-full sm:w-auto lg:mt-6">
            <ShareButton />
          </div>

          {/* Optional: Multiple Qualities / Server Selection */}
          {videos?.length > 1 && (
            <div className="flex flex-col items-start lg:items-end w-full mt-4 sm:mt-0">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2">
                Available Sources
              </span>
              <div className="flex flex-wrap lg:justify-end items-center gap-2">
                {videos.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveUrl(url)}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                      activeUrl === url
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                        : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                    }`}
                  >
                    Source {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;