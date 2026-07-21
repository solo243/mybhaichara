import React from "react";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongooseConnect";
import CardContiner from "@/components/CardContiner";

// 1. Direct DB connection for getting the video page
const fetchVideosFromDB = async (page = 1, limit = 20) => {
  await connectDB();
  const db = mongoose.connection.db;
  const videoCollection = db.collection("videos");

  const skip = (page - 1) * limit;

  const [rawVideos, totalVideos] = await Promise.all([
    videoCollection.find({}).skip(skip).limit(limit).toArray(),
    videoCollection.countDocuments(),
  ]);

  return {
    fetchedVideos: rawVideos.map((video) => ({
      ...video,
      _id: video._id.toString(),
    })),
    totalPages: Math.ceil(totalVideos / limit) || 1,
    totalVideos,
  };
};

// 2. Next.js native cache (Replaces your memory Map)
export const getCachedVideoPage = unstable_cache(
  async (page, limit) => fetchVideosFromDB(page, limit),
  ["video-page"],
  { revalidate: 60, tags: ["videos"] },
);

export async function getVideoPage({ page = 1, limit = 20 } = {}) {
  return getCachedVideoPage(page, limit);
}

// 3. Direct DB connection for a single video
export async function getVideoById(id) {
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
}

// 4. Direct DB connection for recommended videos
export async function getRecommendedVideos(currentId, limit = 8) {
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
}

// 5. Direct DB connection for random home videos
export async function getRandomHomeVideos(limit = 8) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const videoCollection = db.collection("videos");

    const total = await videoCollection.countDocuments();
    if (total === 0) return [];

    const randomSkip = Math.max(0, Math.floor(Math.random() * total));
    const rawVideos = await videoCollection
      .find({})
      .skip(randomSkip)
      .limit(limit)
      .toArray();

    return rawVideos.map((video) => ({
      ...video,
      _id: video._id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch random home videos:", error);
    return [];
  }
}

// 6. Your main component
const FetchVideo = async ({ page = 1, limit = 20, data = null }) => {
  const videos = data ?? (await getVideoPage({ page, limit })).fetchedVideos;

  return (
    <div className="w-full">
      <CardContiner data={videos} />
    </div>
  );
};

export default FetchVideo;
