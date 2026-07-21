import React from "react";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongooseConnect";
import CardContiner from "@/components/CardContiner";

const exploreCache = new Map();
const videoCache = new Map();

async function fetchFromProxy({ page = 1, limit = 20 } = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = new URL(`${baseUrl}/api/home`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch videos from proxy");
    }

    return response.json();
  } catch (error) {
    console.warn(
      "Proxy unavailable, falling back to direct DB access:",
      error.message,
    );

    await connectDB();
    const db = mongoose.connection.db;
    const videoCollection = db.collection("videos");
    const skip = (page - 1) * limit;
    const rawVideos = await videoCollection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    const totalVideos = await videoCollection.countDocuments();

    return {
      data: rawVideos.map((video) => ({
        ...video,
        _id: video._id.toString(),
      })),
      pagination: {
        totalItems: totalVideos,
        totalPages: Math.ceil(totalVideos / limit),
      },
    };
  }
}

const getCachedVideoPage = unstable_cache(
  async (page, limit) => {
    const cacheKey = `explore:${page}:${limit}`;

    if (exploreCache.has(cacheKey)) {
      return exploreCache.get(cacheKey);
    }

    let fetchedVideos = [];
    let totalPages = 1;
    let totalVideos = 0;

    try {
      const proxyResult = await fetchFromProxy({ page, limit });

      fetchedVideos = (proxyResult?.data || []).map((video) => ({
        ...video,
        _id: video._id?.toString?.() || video._id,
      }));

      totalVideos = proxyResult?.pagination?.totalItems || 0;
      totalPages = proxyResult?.pagination?.totalPages || 1;
    } catch (error) {
      console.error("Proxy fetch failed:", error);
    }

    const result = {
      fetchedVideos,
      totalPages,
      totalVideos,
    };

    exploreCache.set(cacheKey, result);
    return result;
  },
  ["video-page"],
  {
    revalidate: 60,
    tags: ["videos"],
  },
);

export async function getVideoPage({ page = 1, limit = 20 } = {}) {
  return getCachedVideoPage(page, limit);
}

export async function getVideoById(id) {
  if (!id) return null;

  const cacheKey = `video:${id}`;
  if (videoCache.has(cacheKey)) {
    return videoCache.get(cacheKey);
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const proxyUrl = new URL(`${baseUrl}/api/home`);
    proxyUrl.searchParams.set("videoId", String(id));

    const response = await fetch(proxyUrl.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch video from proxy");
    }

    const proxyResult = await response.json();
    const video = proxyResult?.video;

    if (!video) return null;

    const serializedVideo = {
      ...video,
      _id: video._id?.toString?.() || video._id,
    };

    videoCache.set(cacheKey, serializedVideo);
    return serializedVideo;
  } catch (error) {
    console.warn(
      "Video proxy unavailable, falling back to direct DB access:",
      error.message,
    );

    await connectDB();
    const db = mongoose.connection.db;
    const videoCollection = db.collection("videos");
    const query = mongoose.isValidObjectId(id)
      ? { _id: new mongoose.Types.ObjectId(id) }
      : { _id: id };

    const video = await videoCollection.findOne(query);

    if (!video) return null;

    const serializedVideo = {
      ...video,
      _id: video._id.toString(),
    };

    videoCache.set(cacheKey, serializedVideo);
    return serializedVideo;
  }
}

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

const FetchVideo = async ({ page = 1, limit = 20, data = null }) => {
  const videos = data ?? (await getVideoPage({ page, limit })).fetchedVideos;

  return (
    <div className="w-full">
      <CardContiner data={videos} />
    </div>
  );
};

export default FetchVideo;
