import { notFound } from "next/navigation";
import React from "react";

import { getRecommendedVideos, getVideoById } from "@/lib/FetchVideo";
import CardContiner from "@/components/CardContiner";
import VideoPlayer from "@/components/VideoPlayer";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const data = await getVideoById(resolvedParams.id);

  if (!data) {
    return { title: "Video Not Found" };
  }

  const title = data.title;
  const description = `Watch ${title} on LeafTV. High quality, fast streaming, and more recommended videos.`;

  return {
    title: title,
    description: description,

    openGraph: {
      title: title,
      description: description,
      type: "video.movie",
    },
  };
}

const PostPage = async ({ params }) => {
  const resolvedParams = await params;
  const videoId = resolvedParams.id;

  const data = await getVideoById(videoId);

  if (!data) {
    notFound();
  }

  const recommendations = await getRecommendedVideos(videoId, 8);
  const title = data?.title || "Video title unavailable";
  const videoUrls = data?.videos || [];
  const shareCode = data?.videoId || data?._id || "NA";

  return (
    <main className="min-h-screen bg-black md:pt-8 pb-10  md:px-0">
      <div className="mx-auto max-w-6xl">
        {/* Pass the Info and Action buttons inside the VideoPlayer */}
        <VideoPlayer videos={videoUrls} title={title}>
          {/* Video Information */}
          <div className="mt-6">
            <h1 className="text-2xl line-clamp-4 md:text-3xl font-semibold text-white">
              {title}
            </h1>
            <p className="md:mt-2 mt-1 md:text-lg text-base text-neutral-400">
              Post ID: #{shareCode}
            </p>
          </div>{" "}
        </VideoPlayer>

        {/* Recommendations */}
        {recommendations?.length > 0 && (
          <div className="mt-8">
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
