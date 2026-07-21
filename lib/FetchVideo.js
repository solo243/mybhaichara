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

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch videos from proxy");
  }

  const result = await response.json();
  return result;
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
    console.error("Failed to fetch video by id:", error);
    return null;
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
