import React from "react";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongooseConnect";
import CardContiner from "@/components/CardContiner";

const BUILD_ID =
  process.env.VERCEL_DEPLOYMENT_ID ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  "local-dev";

// 1. Direct DB connection for getting the video page
export const getVideoPage = async ({ page = 1, limit = 20 } = {}) => {
  const fetchCachedPage = unstable_cache(
    async (p, l) => {
      await connectDB();
      const db = mongoose.connection.db;
      const videoCollection = db.collection("videos");

      const skip = (p - 1) * l;

      const [rawVideos, totalVideos] = await Promise.all([
        videoCollection.find({}).skip(skip).limit(l).toArray(),
        videoCollection.countDocuments(),
      ]);

      const fetchedVideos = rawVideos.map((video) => ({
        ...video,
        _id: video._id.toString(),
      }));

      return {
        fetchedVideos,
        totalPages: Math.ceil(totalVideos / l) || 1,
        totalVideos,
      };
    },
    [`video-page-p${page}-l${limit}-${BUILD_ID}`],
    {
      revalidate: 180, // Refreshes every 60 seconds without needing a deploy
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
      const videoCollection = db.collection("videos");

      const query = mongoose.isValidObjectId(videoId)
        ? { _id: new mongoose.Types.ObjectId(videoId) }
        : { _id: videoId };

      const video = await videoCollection.findOne(query);

      if (!video) return null;

      return {
        ...video,
        _id: video._id.toString(),
      };
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
export const getRecommendedVideos = async (currentId, limit = 8) => {
  const fetchCachedRecommendations = unstable_cache(
    async (cId, lmt) => {
      try {
        await connectDB();
        const db = mongoose.connection.db;
        const videoCollection = db.collection("videos");

        const query =
          cId && mongoose.isValidObjectId(cId)
            ? { _id: { $ne: new mongoose.Types.ObjectId(cId) } }
            : { _id: { $ne: cId } };

        const total = await videoCollection.countDocuments(query);
        if (total === 0) return [];

        const randomSkip = Math.max(0, Math.floor(Math.random() * total));
        const rawVideos = await videoCollection
          .find(query)
          .skip(randomSkip)
          .limit(lmt)
          .toArray();

        return rawVideos.map((video) => ({
          ...video,
          _id: video._id.toString(),
        }));
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        return [];
      }
    },
    [`recommended-videos-${currentId}-${limit}-${BUILD_ID}`],
    {
      revalidate: 180, // Recommendations will automatically shuffle every 60 seconds
      tags: ["recommendations"],
    },
  );

  return fetchCachedRecommendations(currentId, limit);
};

// 4. Direct DB connection for random home videos
export const getRandomHomeVideos = async (limit = 8) => {
  const fetchCachedRandom = unstable_cache(
    async (lmt) => {
      try {
        await connectDB();
        const db = mongoose.connection.db;
        const videoCollection = db.collection("videos");

        const rawVideos = await videoCollection
          .aggregate([{ $sample: { size: lmt } }])
          .toArray();

        return rawVideos.map((video) => ({
          ...video,
          _id: video._id.toString(),
        }));
      } catch (error) {
        console.error("Failed to fetch random home videos:", error);
        return [];
      }
    },
    [`random-home-videos-${limit}-${BUILD_ID}`],
    {
      revalidate: 300, // Homepage random videos shuffle automatically every 60 seconds
      tags: ["random-videos"],
    },
  );

  return fetchCachedRandom(limit);
};

// 5. Main component
const FetchVideo = async ({ page = 1, limit = 20, data = null }) => {
  const videos = data ?? (await getVideoPage({ page, limit })).fetchedVideos;

  return (
    <div className="w-full">
      <CardContiner data={videos} />
    </div>
  );
};

export default FetchVideo;
