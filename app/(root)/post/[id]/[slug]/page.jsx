import { notFound } from "next/navigation";
import React from "react";
import { getRecommendedVideos, getVideoById } from "@/lib/FetchVideo";
import CardContiner from "@/components/CardContiner";
import VideoPlayer from "@/components/VideoPlayer";
import TrendingKeywords from "@/components/TrendingKeywords";
import { slugify, parseIsoDuration } from "@/lib/utils";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://leaftv.fun"
).replace(/\/$/, "");

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const data = await getVideoById(resolvedParams.id);

  if (!data) {
    return { title: "Video Not Found" };
  }

  const title = data.title || "Free Video";
  const canonicalUrl = `${SITE_URL}/post/${data._id || resolvedParams.id}/${slugify(title)}`;
  const videoUrls =
    (data?.videos && data.videos.length > 0 ? data.videos : null) ||
    data?.extracted_media?.direct_videos ||
    [];
  const videoUrl = videoUrls[0] || "";
  const thumbnailUrl =
    data?.img_url || data?.homepage_thumbnail || `${SITE_URL}/ogimg.png`;
  const description = `Watch ${title} online in HD on Leaftv. High quality streaming with no subscription or signup required.`;

  return {
    title: title,
    description: description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: `${title} | Watch Free on Leaftv`,
      description: description,
      url: canonicalUrl,
      type: "video.movie",
      siteName: "Leaftv",
      images: [
        {
          url: thumbnailUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      videos: videoUrl
        ? [
            {
              url: videoUrl,
              type: "video/mp4",
              width: 1280,
              height: 720,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [thumbnailUrl],
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

  const isExplore = Boolean(data?.isExplore || data?.source === "explore");
  const recommendations = await getRecommendedVideos(videoId, 24, isExplore);
  const title = data?.title || "Video title unavailable";
  const videoUrls =
    (data?.videos && data.videos.length > 0 ? data.videos : null) ||
    data?.extracted_media?.direct_videos ||
    [];
  const shareCode = data?.videoId || data?.id || data?._id || "NA";

  const primaryVideoUrl = videoUrls[0] || "";
  const pageUrl = `${SITE_URL}/post/${data._id || videoId}/${slugify(title)}`;
  const thumbnailUrl =
    data?.img_url || data?.homepage_thumbnail || `${SITE_URL}/ogimg.png`;
  const isoDuration = parseIsoDuration(data?.duration);
  const publishDate = data?.createdAt
    ? new Date(data.createdAt).toISOString()
    : new Date().toISOString();

  // 1. Schema.org VideoObject Structured Data for Google Video search rich snippets
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description: `Watch ${title} online in HD on Leaftv.`,
    thumbnailUrl: [thumbnailUrl],
    uploadDate: publishDate,
    ...(isoDuration ? { duration: isoDuration } : {}),
    ...(primaryVideoUrl ? { contentUrl: primaryVideoUrl } : {}),
    embedUrl: pageUrl,
    isFamilyFriendly: false,
    publisher: {
      "@type": "Organization",
      name: "Leaftv",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/ogimg.png`,
      },
    },
  };

  // 2. Schema.org BreadcrumbList Structured Data for SERP breadcrumb trails
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Videos",
        item: `${SITE_URL}/search`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: pageUrl,
      },
    ],
  };

  const embedUrls =
    data?.extracted_media?.embedded_players ||
    (data?.embedUrl ? [data.embedUrl] : []);

  return (
    <div className="min-h-screen bg-background md:pt-8 pb-10">
      {/* Structured Data: VideoObject + BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-7xl">
        <VideoPlayer
          key={videoId}
          videos={videoUrls}
          embeds={embedUrls}
          title={title}
        >
          <div className="mt-6 max-md:px-2">
            <h1 className="text-2xl line-clamp-4 md:text-3xl font-semibold text-text-primary">
              {title}
            </h1>
            <p className="md:mt-2 mt-1 md:text-lg text-base text-neutral-400">
              Video ID: #{shareCode}
            </p>
          </div>
        </VideoPlayer>

        {/* Recommendations */}
        {recommendations?.length > 0 && (
          <div className="mt-12">
            <CardContiner
              showToggle={true}
              title={isExplore ? "Explore More Videos" : "Recommended videos"}
              data={recommendations}
            />
          </div>
        )}

        {/* SEO Internal Linking Topics Hub */}
        <TrendingKeywords
          title="Explore Related Searches"
          description="Discover more trending clips, exclusive leaked collections, and popular searches."
          videos={recommendations}
        />
      </div>
    </div>
  );
};

export default PostPage;
