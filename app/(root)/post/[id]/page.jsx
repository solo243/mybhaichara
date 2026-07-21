import { notFound } from "next/navigation";
import React from "react";

import { getRecommendedVideos, getVideoById } from "@/lib/FetchVideo";
import CardContiner from "@/components/CardContiner";
import { Download, Share } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import DownloadButton from "@/components/DownloadButton";

export const revalidate = 60;

const PostPage = async ({ params }) => {
  const resolvedParams = await params;
  const videoId = resolvedParams.id;

  const data = await getVideoById(videoId);
  // const data = [];
  if (!data) {
    notFound();
  }

  const recommendations = await getRecommendedVideos(videoId, 8);

  const title = data?.title || "Video title unavailable";
  const rawVideoUrl = data?.extracted_media?.direct_videos?.[0] || "";

  // const videoUrl = rawVideoUrl
  //   ? `/api/video?url=${encodeURIComponent(rawVideoUrl)}`
  //   : "";
  // const downloadUrl = rawVideoUrl
  //   ? `/api/video?url=${encodeURIComponent(rawVideoUrl)}&download=1&filename=${encodeURIComponent(
  //       `${title}.mp4`,
  //     )}`

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
          >
            {rawVideoUrl ? <source src={rawVideoUrl} type="video/mp4" /> : null}
            Your browser does not support the video tag.
          </video>
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

        {/* Download  */}
        <div className="flex mb-14 items-center mt-4 gap-2">
          {/* {downloadUrl ? (
            <div className=" items-center flex  space-x-2">
              <a
                href={downloadUrl}
                download
                className="inline-flex items-center rounded bg-red-600 px-4 py-2 text-sm font-medium text-white gap-2 transition hover:bg-red-700"
              >
                <Download size={18} />
                Download video
              </a>
            </div>
          ) : null} */}
          {/* <a
            href=""
            className="bg-neutral-900 flex items-center gap-2 cursor-pointer transition hover:bg-neutral-800 px-4 text-sm py-2 rounded"
          >
            <Share size={18} />
            Share
          </a> */}
          {/* <DownloadButton videoUrl={rawVideoUrl} /> */}
          <ShareButton />
        </div>

        {recommendations.length > 0 ? (
          <div className="">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Recommended videos
            </h2>
            <CardContiner data={recommendations} />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default PostPage;
