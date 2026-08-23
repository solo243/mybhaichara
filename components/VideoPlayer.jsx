"use client";

import React, { useState, useEffect, useRef } from "react";
import "plyr/dist/plyr.css";
import ShareButton from "./ShareButton";

const PLYR_CONTROLS = [
  "play-large",
  "play",
  "progress",
  "current-time",
  "mute",
  "volume",
  "settings",
  "pip",
  "fullscreen",
];

const VideoPlayer = ({ videos = [], title, children }) => {
  const videoList = Array.isArray(videos) ? videos.filter(Boolean) : [];
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);

  // Derived activeUrl ensures instant synchronization without useEffect setState cascading
  const activeUrl = videoList[selectedSourceIndex] || videoList[0] || "";
  const videoRef = useRef(null);

  console.log(activeUrl);
  // Initialize and manage Plyr directly on the video element via Ref
  useEffect(() => {
    if (!videoRef.current || !activeUrl) return;

    let player = null;
    let isDestroyed = false;

    import("plyr").then(({ default: Plyr }) => {
      if (isDestroyed || !videoRef.current) return;

      player = new Plyr(videoRef.current, {
        controls: PLYR_CONTROLS,
        clickToPlay: true,
        fullscreen: {
          enabled: true,
          fallback: true,
          iosNative: true,
        },
        playsinline: true,
        autoplay: false,
        preload: "metadata",
      });
    });

    return () => {
      isDestroyed = true;
      if (player) {
        player.destroy();
      }
    };
  }, [activeUrl]);

  if (!activeUrl) {
    return (
      <div className="flex flex-col items-center justify-center w-full aspect-video bg-neutral-900 rounded-xl border border-neutral-800 p-6 text-center">
        <p className="text-neutral-400 font-medium text-base mb-1">
          Video source unavailable
        </p>
        <p className="text-neutral-500 text-sm">
          No playable stream was found for this post.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {/* Direct Player Container */}
      <div className="relative w-full aspect-video max-h-[80vh] bg-black rounded-xl overflow-hidden shadow-2xl [&_.plyr]:h-full [&_.plyr]:w-full">
        <video
          ref={videoRef}
          key={activeUrl}
          className="w-full h-full object-contain"
          playsInline
          controls
          preload="metadata"
          crossOrigin="anonymous"
        >
          <source src={activeUrl} type="video/mp4" />
          Your browser does not support HTML5 video playback.
        </video>
      </div>

      {/* Metadata and Controls Layout */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 md:px-0">
        <div className="flex-1 w-full">{children}</div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 lg:w-[40%]">
          <div className="flex max-md:px-2 items-center gap-6 w-full sm:w-auto lg:mt-6">
            <ShareButton title={title} />
          </div>

          {videoList.length > 1 && (
            <div className="flex flex-col items-start lg:items-end w-full mt-4 sm:mt-0">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2">
                Available Sources
              </span>
              <div className="flex flex-wrap lg:justify-end items-center gap-2">
                {videoList.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedSourceIndex(index)}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 cursor-pointer ${
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
