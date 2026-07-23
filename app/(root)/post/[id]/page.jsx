import { notFound } from "next/navigation";
import React from "react";

import { getRecommendedVideos, getVideoById } from "@/lib/FetchVideo";
import CardContiner from "@/components/CardContiner";
import ShareButton from "@/components/ShareButton";

const PostPage = async ({ params }) => {
  const resolvedParams = await params;
  const videoId = resolvedParams.id;

  const data = await getVideoById(videoId);

  if (!data) {
    notFound();
  }

  const recommendations = await getRecommendedVideos(videoId, 8);

  const title = data?.title || "Video title unavailable";

  const rawVideoUrl = data?.videos?.[0] || "";

  const shareCode = data?.videoId || data?._id || "NA";

  return (
    <main className="min-h-screen bg-black md:pt-8 pb-10">
      <div className="mx-auto max-w-6xl">
        {/* Responsive Video Wrapper */}
        <div className="flex items-center justify-center w-full aspect-video max-h-[85vh] overflow-hidden bg-neutral-900 shadow-2xl">
          {rawVideoUrl ? (
            <iframe
              src={rawVideoUrl}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          ) : (
            <p className="text-neutral-500">Video source not found.</p>
          )}
        </div>

        {/* Video Information */}
        <div className="mt-6">
          <h1 className="text-2xl line-clamp-4 md:text-3xl font-semibold text-white">
            {title}
          </h1>
          <p className="md:mt-2 mt-1 md:text-lg text-base text-neutral-400">
            Post ID: #{shareCode}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex mb-14 items-center mt-4 gap-2">
          {/* <DownloadButton videoUrl={rawVideoUrl} /> */}
          <ShareButton />
        </div>

        {/* Recommendations */}
        {recommendations?.length > 0 && (
          <div className="">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Recommended videos
            </h2>
            <CardContiner data={recommendations} />
          </div>
        )}
      </div>
    </main>
  );
};

export default PostPage;
