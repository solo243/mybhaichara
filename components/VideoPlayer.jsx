"use client";

import React, { useState } from "react";
import ShareButton from "./ShareButton";

const fixVideoUrl = (url) => {
  if (!url) return "";
  if (url.includes("lulustream.com/") && !url.includes("lulustream.com/e/")) {
    return url.replace("lulustream.com/", "lulustream.com/e/");
  }
  return url;
};

const VideoPlayer = ({ videos, title, children }) => {
  const [activeUrl, setActiveUrl] = useState(videos?.[0] || "");

  if (!activeUrl) {
    return (
      <>
        <div className="flex items-center justify-center w-full aspect-video max-h-[85vh] bg-neutral-900 shadow-2xl">
          <p className="text-neutral-500">Video source not found.</p>
        </div>
        {children}
      </>
    );
  }

  const formattedUrl = fixVideoUrl(activeUrl);

  return (
    <div className="w-full">
      {/* 1. The Video Player */}
      <div className="flex items-center justify-center w-full aspect-video max-h-[85vh] overflow-hidden bg-neutral-900 shadow-2xl">
        <iframe
          src={formattedUrl}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      </div>

      {/* 2. The Title and Share Buttons (Passed from PostPage) */}
      {children}

      {/* 3. The Server Buttons (Now rendered below the Share buttons) */}
      {videos.length > 1 && (
        <div className="flex flex-col mt-4 mb-4">
          <span className="text-neutral-400 font-medium mb-1">Servers</span>
          <div className="flex flex-wrap items-center gap-3">
            {videos.map((url, index) => (
              <button
                key={index}
                onClick={() => setActiveUrl(url)}
                className={`px-4 py-1 cursor-pointer rounded font-medium transition-colors ${
                  activeUrl === url
                    ? "bg-red-700 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                Server {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center  gap-2">
        {/* <DownloadButton videoUrl={videoUrls[0]} /> */}

        <ShareButton />
      </div>
    </div>
  );
};

export default VideoPlayer;
