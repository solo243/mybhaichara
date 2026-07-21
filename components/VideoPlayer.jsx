"use client";

import React, { useEffect, useRef } from "react";
import "plyr/dist/plyr.css";
import Plyr from "plyr";

export default function VideoPlayer({ videoUrl }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const player = new Plyr(videoRef.current, {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "pip",
        "fullscreen",
      ],
      fullscreen: {
        enabled: true,
        fallback: false,
        iosNative: true,
      },
      settings: ["quality", "speed"],
    });

    return () => player.destroy();
  }, []);

  return (
    <div className="overflow-hidden  bg-neutral-900">
      <video
        ref={videoRef}
        className="w-full h-auto max-h-[80vh]"
        controls
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}
