import { notFound } from "next/navigation";
import React from "react";

import { getRecommendedVideos, getVideoById } from "@/lib/FetchVideo";
import CardContiner from "@/components/CardContiner";
import VideoPlayer from "@/components/VideoPlayer";

const SITE_URL = "https://leaftv.fun";

// Helper function: Converts "2:57" or "1:02:30" to ISO 8601 duration "PT2M57S" / "PT1H2M30S"
function parseIsoDuration(durationStr) {
  if (!durationStr) return undefined;
  const parts = durationStr.split(":").map(Number);
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return `PT${minutes}M${seconds}S`;
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return `PT${hours}H${minutes}M${seconds}S`;
  }
  return undefined;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const data = await getVideoById(resolvedParams.id);

  if (!data) {
    return { title: "Video Not Found" };
  }

  const title = data.title || "Free Video";
  const slug = resolvedParams.slug || "video";
  const canonicalUrl = `${SITE_URL}/post/${data._id}/${slug}`;
  const videoUrl = data?.videos?.[0] || "";
  const thumbnailUrl = data?.img_url || `${SITE_URL}/ogimg.jpg`;
  const description = `Watch ${title} on Bhaichara. High quality, fast streaming, and free online viewing.`;

  return {
    title: title,
    description: description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      type: "video.movie",
      images: [
        {
          url: thumbnailUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      videos: videoUrl ? [{ url: videoUrl, type: "video/mp4" }] : [],
    },
  };
}

const PostPage = async ({ params }) => {
  const resolvedParams = await params;
  const videoId = resolvedParams.id;
  const slug = resolvedParams.slug || "video";

  const data = await getVideoById(videoId);

  if (!data) {
    notFound();
  }

  const recommendations = await getRecommendedVideos(videoId, 8);
  const title = data?.title || "Video title unavailable";
  const videoUrls = data?.videos || [];
  const shareCode = data?.videoId || data?._id || "NA";

  const primaryVideoUrl = videoUrls[0] || "";
  const pageUrl = `${SITE_URL}/post/${data._id}/${slug}`;
  const thumbnailUrl = data?.img_url || `${SITE_URL}/ogimg.jpg`;
  const isoDuration = parseIsoDuration(data?.duration);

  // Schema.org VideoObject Structured Data mapped to your database schema
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description: `Watch ${title} online for free on Bhaichara.`,
    thumbnailUrl: [thumbnailUrl],
    uploadDate: data?.createdAt
      ? new Date(data.createdAt).toISOString()
      : new Date().toISOString(),
    duration: isoDuration, // Outputs: "PT2M57S"
    contentUrl: primaryVideoUrl, // Points to https://mycdn.leaftv.fun/...
    embedUrl: pageUrl,
  };

  return (
    <main className="min-h-screen bg-background md:pt-8 pb-10">
      {/* JSON-LD Video Schema injected into DOM for Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

      <div className="mx-auto max-w-7xl">
        <VideoPlayer videos={videoUrls} title={title}>
          <div className="mt-6 max-md:px-2">
            <h1 className="text-2xl line-clamp-4 md:text-3xl font-semibold text-text-primary">
              {title}
            </h1>
            <p className="md:mt-2 mt-1 md:text-lg text-base text-neutral-400">
              Post ID: #{shareCode}
            </p>
          </div>
        </VideoPlayer>

        {/* Recommendations */}
        {recommendations?.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 max-md:px-2 text-2xl font-semibold text-text-primary">
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
