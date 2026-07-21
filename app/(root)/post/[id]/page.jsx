import { notFound } from "next/navigation";
import React from "react";

import { getVideoById } from "@/lib/FetchVideo";

export const revalidate = 60;

const PostPage = async ({ params }) => {
  const resolvedParams = await params;
  const videoId = resolvedParams.id;

  const data = await getVideoById(videoId);

  if (!data) {
    notFound();
  }

  const videoUrl = data?.extracted_media?.direct_videos?.[0] || "";
  const title = data?.title || "Video title unavailable";
  const postId = data?.id || data?._id || "NA";

  return (
    <main className="min-h-screen bg-black md:pt-8 pb-10">
      <div className="mx-auto max-w-6xl ">
        {/* Responsive Video Wrapper */}
        <div className="flex items-center justify-center w-full max-h-[85vh] overflow-hidden  bg-neutral-900 shadow-2xl">
          <video
            className="w-full max-h-[85vh] object-contain"
            controls
            playsInline
            preload="metadata"
            muted
            controlsList="nodownload"
          >
            {videoUrl ? <source src={videoUrl} type="video/mp4" /> : null}
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Information */}
        <div className="mt-6">
          <h1 className="text-2xl line-clamp-4 md:text-3xl font-semibold text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm text-neutral-400">ID: #{postId}</p>
        </div>
      </div>
    </main>
  );
};

export default PostPage;
