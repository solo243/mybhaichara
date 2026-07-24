import React from "react";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongooseConnect";
import CardContiner from "@/components/CardContiner";

// 1. Direct DB connection for getting ONLY the video data
const fetchOnlyVideosFromDB = async (page = 1, limit = 20) => {
  await connectDB();
  const db = mongoose.connection.db;
  const videoCollection = db.collection("videos");

  const skip = (page - 1) * limit;

  const rawVideos = await videoCollection
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray();

  return rawVideos.map((video) => ({
    ...video,
    _id: video._id.toString(),
  }));
};

// 2. Next.js native cache (Caches ONLY the video arrays for 3 minutes)
export const getCachedVideosOnly = unstable_cache(
  async (page, limit) => fetchOnlyVideosFromDB(page, limit),
  ["mypage-videos-only"], // Changed cache key to avoid conflicts with previous version
  { revalidate: 180, tags: ["myvideos"] },
);

// 3. Main wrapper: combines CACHED videos with LIVE total counts
export async function getVideoPage({ page = 1, limit = 20 } = {}) {
  await connectDB();
  const db = mongoose.connection.db;
  const videoCollection = db.collection("videos");

  // Fetch cached videos and live counts in parallel
  const [fetchedVideos, totalVideos] = await Promise.all([
    getCachedVideosOnly(page, limit),
    videoCollection.countDocuments(),
  ]);

  return {
    fetchedVideos,
    totalPages: Math.ceil(totalVideos / limit) || 1,
    totalVideos,
  };
}

// 4. Direct DB connection for a single video (Cached for 3 minutes)
// 4. Direct DB connection for a single video (Cached uniquely by ID for 3 minutes)
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
    [`video-by-id-${id}`],
    {
      revalidate: 180,
      tags: ["single-video", `video-${id}`],
    },
  );

  return fetchCachedVideo(id);
};

// 5. Direct DB connection for recommended videos (Cached uniquely per currentId for 3 minutes)
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
    [`recommended-videos-${currentId}-${limit}`], // DYNAMIC KEY
    {
      revalidate: 180,
      tags: ["recommendations", `rec-${currentId}`],
    },
  );

  return fetchCachedRecommendations(currentId, limit);
};

export const getRandomHomeVideos = unstable_cache(
  async (limit = 8) => {
    try {
      await connectDB();
      const db = mongoose.connection.db;
      const videoCollection = db.collection("videos");

      // MongoDB's $sample safely grabs exactly "limit" random documents
      const rawVideos = await videoCollection
        .aggregate([{ $sample: { size: limit } }])
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
  ["random-home-videos"],
  // 3600 seconds = 1 hour cache duration
  { revalidate: 3600, tags: ["random-videos"] },
);

// 7. Your main component
const FetchVideo = async ({ page = 1, limit = 20, data = null }) => {
  const videos = data ?? (await getVideoPage({ page, limit })).fetchedVideos;

  return (
    <div className="w-full">
      <CardContiner data={videos} />
    </div>
  );
};

export default FetchVideo;
