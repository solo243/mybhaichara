"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { slugify } from "@/lib/utils";

const Card = ({ data, isDense = false }) => {
  const previewUrl = data?.preview || "";

  const postData = {
    title: data?.title || "Title is not available",
    img_url: data?.img_url || data?.homepage_thumbnail || data?.thumbnail || "",
    duration: data?.duration || "NA",
    videoId: data?.videoId || data?.id || "NA",
    _id: data?._id || data?.id || "",
    previewUrl,
  };

  const slug = slugify(postData.title);

  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const hoverTimerRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!previewUrl) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    // 150ms quick debounce before mounting preview
    hoverTimerRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsHovered(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      href={`/post/${postData._id}/${slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group mb-2 sm:mb-4 cursor-pointer block w-full overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-surface ">
        {/* Static Thumbnail Image */}
        {postData.img_url ? (
          <Image
            src={postData.img_url}
            alt={postData.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              isPlaying ? "opacity-0" : "opacity-100"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-neutral-800 to-neutral-900 text-xs sm:text-sm font-medium text-neutral-400">
            No preview available
          </div>
        )}

        {/* Hover Video Preview Player (Only for cards with preview MP4, e.g. Explore cards) */}
        {isHovered && previewUrl && (
          <video
            ref={videoRef}
            src={previewUrl}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            onLoadedData={() => setIsPlaying(true)}
            onPlaying={() => setIsPlaying(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isPlaying ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Live Preview Indicator on Hover */}
        {/* {isPlaying && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-in fade-in zoom-in-75 duration-200 z-10 pointer-events-none">
            <Play className="w-2.5 h-2.5 fill-white" />
            <span>PREVIEW</span>
          </div>
        )} */}

        {/* Duration Badge */}
        <span className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 rounded bg-black/80 px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-text-primary backdrop-blur-sm z-10">
          {postData.duration}
        </span>
      </div>

      <div className="mt-1.5 sm:mt-2 max-md:px-1 py-0.5 sm:py-1">
        <div
          className={`line-clamp-2 font-semibold text-text-primary transition-colors ${
            isDense
              ? "text-[13.5px] sm:text-sm md:text-sm"
              : "text-base sm:text-base"
          }`}
        >
          {postData.title}
        </div>

        <div
          className={`mt-1 flex items-center justify-between text-text-secondary font-medium ${
            isDense ? "text-xs" : "text-sm"
          }`}
        >
          <div>ID: #{postData.videoId}</div>
          <div className="flex items-center gap-1 transition group-hover:translate-x-0.5 text-text-secondary">
            <span>Watch</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
