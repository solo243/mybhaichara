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
export const getVideoById = unstable_cache(
  async (id) => {
    if (!id) return null;

    await connectDB();
    const db = mongoose.connection.db;
    const videoCollection = db.collection("videos");

    const query = mongoose.isValidObjectId(id)
      ? { _id: new mongoose.Types.ObjectId(id) }
      : { _id: id };

    const video = await videoCollection.findOne(query);

    if (!video) return null;

    return {
      ...video,
      _id: video._id.toString(),
    };
  },
  ["video-by-id"],
  { revalidate: 180, tags: ["single-video"] },
);

// 5. Direct DB connection for recommended videos (Cached for 3 minutes)
export const getRecommendedVideos = unstable_cache(
  async (currentId, limit = 8) => {
    try {
      await connectDB();
      const db = mongoose.connection.db;
      const videoCollection = db.collection("videos");

      const query =
        currentId && mongoose.isValidObjectId(currentId)
          ? { _id: { $ne: new mongoose.Types.ObjectId(currentId) } }
          : { _id: { $ne: currentId } };

      const total = await videoCollection.countDocuments(query);
      if (total === 0) return [];

      const randomSkip = Math.max(0, Math.floor(Math.random() * total));
      const rawVideos = await videoCollection
        .find(query)
        .skip(randomSkip)
        .limit(limit)
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
  ["recommended-videos"],
  { revalidate: 180, tags: ["recommendations"] },
);

// 6. Direct DB connection for random home videos (Cached for 3 minutes)
// export const getRandomHomeVideos = unstable_cache(
//   async (limit = 8) => {
//     try {
//       await connectDB();
//       const db = mongoose.connection.db;
//       const videoCollection = db.collection("videos");

//       const total = await videoCollection.countDocuments();
//       if (total === 0) return [];

//       const randomSkip = Math.max(0, Math.floor(Math.random() * total));
//       const rawVideos = await videoCollection
//         .find({})
//         .skip(randomSkip)
//         .limit(limit)
//         .toArray();

//       return rawVideos.map((video) => ({
//         ...video,
//         _id: video._id.toString(),
//       }));
//     } catch (error) {
//       console.error("Failed to fetch random home videos:", error);
//       return [];
//     }
//   },
//   ["random-home-videos"],
//   { revalidate: 250, tags: ["random-videos"] },
// );
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
