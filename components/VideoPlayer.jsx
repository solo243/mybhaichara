"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// 1. Import official Plyr CSS
import "plyr/dist/plyr.css";

import ShareButton from "./ShareButton";

// 2. Dynamically import Plyr with SSR disabled
const PlyrPlayer = dynamic(
  () => import("plyr-react").then((mod) => mod.Plyr || mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-neutral-900">
        <span className="text-neutral-500 font-medium animate-pulse">
          Initializing Player...
        </span>
      </div>
    ),
  },
);

const VideoPlayer = ({ videos, title, children }) => {
  const [activeUrl, setActiveUrl] = useState(videos?.[0] || "");
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const playerRef = useRef(null);

  // Reset states whenever the video URL changes
  useEffect(() => {
    setIsReady(false);
    setHasError(false);
  }, [activeUrl]);

  // Listen to Plyr video loading events
  useEffect(() => {
    let playerInstance = null;

    const attachListeners = () => {
      playerInstance = playerRef.current?.plyr;

      if (playerInstance) {
        const handleReady = () => {
          setIsReady(true);
          setHasError(false);
        };

        const handleError = () => {
          setHasError(true);
          setIsReady(false);
        };

        // Attach event listeners to Plyr
        playerInstance.on("canplay", handleReady);
        playerInstance.on("loadeddata", handleReady);
        playerInstance.on("error", handleError);

        // Check if media is already ready
        if (playerInstance.media && playerInstance.media.readyState >= 3) {
          setIsReady(true);
        }
      }
    };

    // Small delay to ensure dynamic component ref is attached
    const timer = setTimeout(attachListeners, 150);

    return () => {
      clearTimeout(timer);
      if (playerInstance) {
        playerInstance.off("canplay", () => {});
        playerInstance.off("loadeddata", () => {});
        playerInstance.off("error", () => {});
      }
    };
  }, [activeUrl]);

  if (!activeUrl) {
    return (
      <div className="flex items-center justify-center w-full aspect-video bg-neutral-900 rounded-xl border border-neutral-800">
        <p className="text-neutral-500 font-medium">Video file not found.</p>
      </div>
    );
  }

  const plyrOptions = {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "settings",
      "pip",
      "fullscreen",
    ],
    clickToPlay: true,
    fullscreen: {
      enabled: true,
      fallback: true,
      iosNative: true,
    },
    playsinline: true,
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
      {/* Player Container */}
      <div className="relative w-full aspect-video max-h-[80vh] bg-black rounded-xl overflow-hidden shadow-2xl [&_.plyr]:h-full [&_.plyr]:w-full">
        {/* Loading Overlay (Visible while video buffers/fetches) */}
        {!isReady && !hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-900 duration-300">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-neutral-400 font-medium text-sm animate-pulse">
              Loading...
            </span>
          </div>
        )}

        {/* Error Overlay */}
        {hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-900 px-4 text-center">
            <p className="text-red-400 font-medium mb-2">
              Unable to load or stream video.
            </p>
            <button
              onClick={() => {
                setHasError(false);
                setIsReady(false);
                // Force reload current active URL
                const current = activeUrl;
                setActiveUrl("");
                setTimeout(() => setActiveUrl(current), 50);
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-medium rounded-lg transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dynamic Plyr Player (Kept mounted underneath so initialization can complete) */}
        <PlyrPlayer ref={playerRef} source={plyrSource} options={plyrOptions} />
      </div>

      {/* Metadata and Controls Layout */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 md:px-0">
        <div className="flex-1 w-full">{children}</div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 lg:w-[40%]">
          <div className="flex max-md:px-2 items-center gap-6 w-full sm:w-auto lg:mt-6">
            <ShareButton />
          </div>

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
                        ? "bg-primary text-text-primary shadow-lg shadow-primary/40"
                        : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-text-primary"
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
