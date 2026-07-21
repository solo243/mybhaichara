import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { getRecommendedVideos, getVideoById } from "@/lib/FetchVideo";
import CardContiner from "@/components/CardContiner";

export const revalidate = 60;

const PostPage = async ({ params }) => {
  const resolvedParams = await params;
  const videoId = resolvedParams.id;

  const data = await getVideoById(videoId);

  if (!data) {
    notFound();
  }

  const recommendations = await getRecommendedVideos(videoId, 8);

  const videoUrl = data?.extracted_media?.direct_videos?.[0] || "";
  const title = data?.title || "Video title unavailable";
  const shareCode = data?.shareCode || data?._id || "NA";

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
          <p className="mt-2 text-lg text-neutral-400">Post ID: #{shareCode}</p>
        </div>

        {recommendations.length > 0 ? (
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Recommended videos
            </h2>
            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"> */}
            <CardContiner data={recommendations} />
            {/* </div> */}
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default PostPage;
