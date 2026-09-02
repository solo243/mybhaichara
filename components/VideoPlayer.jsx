"use client";

import React, { useState, useEffect, useRef } from "react";
import "plyr/dist/plyr.css";
import { RotateCcw, RotateCw, Play, Pause } from "lucide-react";
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
  const plyrRef = useRef(null);

  // YouTube-style feedback state
  const [doubleTapSide, setDoubleTapSide] = useState(null); // 'left' | 'right' | null
  const [playFeedback, setPlayFeedback] = useState(null); // 'play' | 'pause' | null

  const doubleTapTimerRef = useRef(null);
  const singleTapTimerRef = useRef(null);
  const playFeedbackTimerRef = useRef(null);
  const lastTapRef = useRef({ time: 0, side: null });

  // Initialize and manage Plyr directly on the video element via Ref
  useEffect(() => {
    if (!videoRef.current || !activeUrl) return;

    let player = null;
    let isDestroyed = false;

    import("plyr")
      .then(({ default: Plyr }) => {
        if (isDestroyed || !videoRef.current) return;

        player = new Plyr(videoRef.current, {
          controls: PLYR_CONTROLS,
          clickToPlay: false, // Managed by our gesture system
          fullscreen: {
            enabled: true,
            fallback: true,
            iosNative: true,
          },
          playsinline: true,
          autoplay: false,
          preload: "metadata",
        });

        plyrRef.current = player;
      })
      .catch(() => {});

    return () => {
      isDestroyed = true;
      if (player) {
        try {
          player.destroy();
        } catch {
          // Ignore destroy errors
        }
      }
      plyrRef.current = null;
    };
  }, [activeUrl]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (doubleTapTimerRef.current) clearTimeout(doubleTapTimerRef.current);
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
      if (playFeedbackTimerRef.current)
        clearTimeout(playFeedbackTimerRef.current);
    };
  }, []);

  // Toggle Play / Pause with feedback icon
  const togglePlayPause = () => {
    const video = videoRef.current;
    const player = plyrRef.current;

    let willPlay = false;

    if (player) {
      willPlay = player.paused;
      try {
        const promise = player.togglePlay();
        if (promise && typeof promise.catch === "function") {
          promise.catch(() => {});
        }
      } catch {
        // Ignore play interruption error
      }
    } else if (video) {
      if (video.paused || video.ended) {
        willPlay = true;
        video.play().catch(() => {});
      } else {
        willPlay = false;
        video.pause();
      }
    }

    // Show brief center Play/Pause pulse icon
    setPlayFeedback(willPlay ? "play" : "pause");
    if (playFeedbackTimerRef.current)
      clearTimeout(playFeedbackTimerRef.current);
    playFeedbackTimerRef.current = setTimeout(() => {
      setPlayFeedback(null);
    }, 600);
  };

  // Center Tap: Immediate Play/Pause toggle
  const handleCenterTap = (e) => {
    e.stopPropagation();
    if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
    lastTapRef.current = { time: 0, side: null };
    togglePlayPause();
  };

  // Side Tap: Detects single tap (Play/Pause) vs double tap (-10s / +10s seek)
  const handleSideTap = (side, e) => {
    e.stopPropagation();
    const now = Date.now();
    const lastTap = lastTapRef.current;

    // Check if double tap occurred on the same side within 300ms
    if (lastTap.side === side && now - lastTap.time < 300) {
      // Cancel pending single tap
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
      lastTapRef.current = { time: 0, side: null };

      if (side === "left") {
        if (plyrRef.current) {
          plyrRef.current.rewind(10);
        } else if (videoRef.current) {
          videoRef.current.currentTime = Math.max(
            0,
            videoRef.current.currentTime - 10,
          );
        }
      } else if (side === "right") {
        if (plyrRef.current) {
          plyrRef.current.forward(10);
        } else if (videoRef.current) {
          const duration = videoRef.current.duration || 999999;
          videoRef.current.currentTime = Math.min(
            duration,
            videoRef.current.currentTime + 10,
          );
        }
      }

      // Show YouTube-like ripple animation
      setDoubleTapSide(side);
      if (doubleTapTimerRef.current) clearTimeout(doubleTapTimerRef.current);
      doubleTapTimerRef.current = setTimeout(() => {
        setDoubleTapSide(null);
      }, 650);
    } else {
      // First tap on this side: start timer for single tap play/pause
      lastTapRef.current = { time: now, side };
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = setTimeout(() => {
        togglePlayPause();
        lastTapRef.current = { time: 0, side: null };
      }, 260);
    }
  };

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
    <div className="w-full flex flex-col select-none">
      {/* Direct Player Container */}
      <div className="relative w-full aspect-video max-h-[80vh] bg-black  overflow-hidden shadow-2xl [&_.plyr]:h-full [&_.plyr]:w-full">
        <video
          ref={videoRef}
          key={activeUrl}
          className="w-full h-full object-contain"
          playsInline
          controls
          preload="metadata"
        >
          <source src={activeUrl} type="video/mp4" />
          Your browser does not support HTML5 video playback.
        </video>

        {/* Gesture Zones (Left 40%, Center 20%, Right 40%) */}
        <div className="absolute inset-0 bottom-12 z-10 flex pointer-events-auto">
          {/* Left 40% (Single tap: play/pause after delay, Double tap: -10s) */}
          <div
            onClick={(e) => handleSideTap("left", e)}
            className="w-[40%] h-full cursor-pointer"
            aria-label="Double tap to rewind 10 seconds"
          />

          {/* Center 20% (Single tap: instant play/pause) */}
          <div
            onClick={handleCenterTap}
            className="w-[20%] h-full cursor-pointer flex items-center justify-center"
            aria-label="Tap to toggle play or pause"
          />

          {/* Right 40% (Single tap: play/pause after delay, Double tap: +10s) */}
          <div
            onClick={(e) => handleSideTap("right", e)}
            className="w-[40%] h-full cursor-pointer"
            aria-label="Double tap to forward 10 seconds"
          />
        </div>

        {/* YouTube-style Center Play / Pause Pulse Feedback */}
        {playFeedback && (
          <div className="absolute inset-0 bottom-12 flex items-center justify-center pointer-events-none z-20 animate-in fade-in zoom-in-75 duration-150">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/70 text-white border border-white/20 shadow-2xl backdrop-blur-xs">
              {playFeedback === "play" ? (
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-0.5" />
              ) : (
                <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-white" />
              )}
            </div>
          </div>
        )}

        {/* YouTube-style Left Ripple Feedback (-10s) */}
        {doubleTapSide === "left" && (
          <div className="absolute inset-y-0 left-0 w-1/2 bg-white/10 rounded-r-full flex flex-col items-center justify-center pointer-events-none animate-in fade-in zoom-in-95 duration-200 z-20">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-black/60 text-white border border-white/20 shadow-2xl mb-1 backdrop-blur-xs">
              <RotateCcw className="w-7 h-7 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-white tracking-wider bg-black/70 px-3 py-1 rounded-full shadow-md">
              -10 seconds
            </span>
          </div>
        )}

        {/* YouTube-style Right Ripple Feedback (+10s) */}
        {doubleTapSide === "right" && (
          <div className="absolute inset-y-0 right-0 w-1/2 bg-white/10 rounded-l-full flex flex-col items-center justify-center pointer-events-none animate-in fade-in zoom-in-95 duration-200 z-20">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-black/60 text-white border border-white/20 shadow-2xl mb-1 backdrop-blur-xs">
              <RotateCw className="w-7 h-7 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-white tracking-wider bg-black/70 px-3 py-1 rounded-full shadow-md">
              +10 seconds
            </span>
          </div>
        )}
      </div>

      {/* Metadata and Controls Layout */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 md:px-0 mt-4">
        <div className="flex-1 w-full">{children}</div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 lg:w-[40%]">
          <div className="flex max-md:px-2 items-center gap-6 w-full sm:w-auto lg:mt-2">
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
