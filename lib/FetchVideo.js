import React from "react";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongooseConnect";
import CardContiner from "@/components/CardContiner";

const BUILD_ID =
  process.env.CF_PAGES_COMMIT_SHA ||
  process.env.CF_PAGES_BRANCH ||
  process.env.VERCEL_DEPLOYMENT_ID ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.BUILD_ID ||
  "local-dev";

// Helper to normalize video documents from MongoDB
export const normalizeVideo = (video) => {
  if (!video) return null;
  const directVideos =
    (video.videos && Array.isArray(video.videos) && video.videos.length > 0
      ? video.videos
      : null) ||
    video.extracted_media?.direct_videos ||
    [];

  return {
    ...video,
    _id: video._id ? video._id.toString() : String(video.id || ""),
    id: video.id || (video._id ? video._id.toString() : ""),
    title: video.title || "Video title unavailable",
    img_url: video.img_url || video.homepage_thumbnail || "",
    homepage_thumbnail: video.homepage_thumbnail || video.img_url || "",
    duration: video.duration || "NA",
    videoId:
      video.videoId || video.id || (video._id ? video._id.toString() : "NA"),
    videos: directVideos,
    extracted_media: {
      direct_videos: directVideos,
      embedded_players: video.extracted_media?.embedded_players || [],
    },
  };
};

// 1. Direct DB connection for getting the video page (used on /explore with pagination)
export const getVideoPage = async ({ page = 1, limit = 40 } = {}) => {
  const fetchCachedPage = unstable_cache(
    async (p, l) => {
      await connectDB();
      const db = mongoose.connection.db;
      const videoCollection = db.collection("bhaicharas");

      const skip = (p - 1) * l;

      const [rawVideos, totalVideos] = await Promise.all([
        videoCollection.find({}).skip(skip).limit(l).toArray(),
        videoCollection.countDocuments(),
      ]);

      const fetchedVideos = rawVideos.map(normalizeVideo);

      return {
        fetchedVideos,
        totalPages: Math.ceil(totalVideos / l) || 1,
        totalVideos,
      };
    },
    [`video-page-p${page}-l${limit}-${BUILD_ID}`],
    {
      revalidate: 180,
      tags: ["video-page"],
    },
  );

  return fetchCachedPage(page, limit);
};

// 2. Direct DB connection for a single video
export const getVideoById = async (id) => {
  if (!id) return null;

  const fetchCachedVideo = unstable_cache(
    async (videoId) => {
      await connectDB();
      const db = mongoose.connection.db;
      const videoCollection = db.collection("bhaicharas");

      const query = mongoose.isValidObjectId(videoId)
        ? {
            $or: [
              { _id: new mongoose.Types.ObjectId(videoId) },
              { id: videoId },
              { videoId: videoId },
            ],
          }
        : {
            $or: [{ _id: videoId }, { id: videoId }, { videoId: videoId }],
          };

      const video = await videoCollection.findOne(query);

      if (!video) return null;

      return normalizeVideo(video);
    },
    [`video-by-id-${id}-${BUILD_ID}`],
    {
      revalidate: 180,
      tags: ["single-video", `video-${id}`],
    },
  );

  return fetchCachedVideo(id);
};

// 3. Direct DB connection for recommended videos
export const getRecommendedVideos = async (currentId, limit = 20) => {
  const fetchCachedRecommendations = unstable_cache(
    async (cId, lmt) => {
      try {
        await connectDB();
        const db = mongoose.connection.db;
        const videoCollection = db.collection("bhaicharas");

        const matchQuery =
          cId && mongoose.isValidObjectId(cId)
            ? {
                $and: [
                  { _id: { $ne: new mongoose.Types.ObjectId(cId) } },
                  { id: { $ne: cId } },
                ],
              }
            : cId
              ? {
                  $and: [{ _id: { $ne: cId } }, { id: { $ne: cId } }],
                }
              : {};

        const rawVideos = await videoCollection
          .aggregate([{ $match: matchQuery }, { $sample: { size: lmt } }])
          .toArray();

        return rawVideos.map(normalizeVideo);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        return [];
      }
    },
    [`recommended-videos-${currentId}-${limit}-${BUILD_ID}`],
    {
      revalidate: 180,
      tags: ["recommendations"],
    },
  );

  return fetchCachedRecommendations(currentId, limit);
};

// 4. Direct DB connection for 34 random home videos (cached for 30 minutes / 1800s)
export const getRandomHomeVideos = async (limit = 40) => {
  const fetchCachedRandom = unstable_cache(
    async (lmt) => {
      try {
        await connectDB();
        const db = mongoose.connection.db;
        const videoCollection = db.collection("bhaicharas");

        const rawVideos = await videoCollection
          .aggregate([{ $sample: { size: lmt } }])
          .toArray();

        return rawVideos.map(normalizeVideo);
      } catch (error) {
        console.error("Failed to fetch random home videos:", error);
        return [];
      }
    },
    [`random-home-videos-${limit}-${BUILD_ID}`],
    {
      revalidate: 1200, // 30 minutes cache
      tags: ["random-videos"],
    },
  );

  return fetchCachedRandom(limit);
};

// 5. Main component
const FetchVideo = async ({
  page = 1,
  limit = 40,
  data = null,
  isHome = false,
}) => {
  const videos = data ?? (await getVideoPage({ page, limit })).fetchedVideos;

  return (
    <div className="w-full">
      <CardContiner
        data={videos}
        title={isHome ? "Explore" : `Page ${page} Results`}
        showToggle={true}
      />
    </div>
  );
};

export default FetchVideo;
