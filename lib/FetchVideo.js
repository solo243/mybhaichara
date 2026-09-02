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

// Helper to format duration from seconds to MM:SS or HH:MM:SS
export function formatDurationSeconds(seconds) {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
    return typeof seconds === "string" ? seconds : "NA";
  }
  const sec = Math.floor(seconds);
  const hrs = Math.floor(sec / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const secs = sec % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

// Helper to normalize video documents from MongoDB
export const normalizeVideo = (video) => {
  if (!video) return null;
  const directVideos =
    (video.videos && Array.isArray(video.videos) && video.videos.length > 0
      ? video.videos
      : null) ||
    video.extracted_media?.direct_videos ||
    [];

  const embedUrls = video.extracted_media?.embedded_players || [];

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
      embedded_players: embedUrls,
    },
    isExplore: false,
    source: "mongodb",
  };
};

// Helper to normalize external API video items (e.g. xxxtv.top)
export const normalizeApiVideo = (item) => {
  if (!item) return null;
  const directVideos = item.preview ? [item.preview] : [];
  const embedUrls = item.embedUrl ? [item.embedUrl] : [];

  return {
    _id: item.id ? String(item.id) : "",
    id: item.id ? String(item.id) : "",
    title: item.title || "Video title unavailable",
    description: item.description || "",
    img_url: item.thumbnail || "",
    homepage_thumbnail: item.thumbnail || "",
    duration: formatDurationSeconds(item.duration),
    videoId: item.id ? String(item.id) : "NA",
    videos: directVideos,
    preview: item.preview || directVideos[0] || "",
    extracted_media: {
      direct_videos: directVideos,
      embedded_players: embedUrls,
    },
    views: item.views || 0,
    pageUrl: item.pageUrl || "",
    embedUrl: item.embedUrl || "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    models: Array.isArray(item.models) ? item.models : [],
    isExplore: true,
    source: "explore",
  };
};

// 1. Direct DB connection for getting the video page
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

// 2. Direct DB connection for getting single video by ID (with external API fallback)
export const getVideoById = async (id) => {
  const fetchCachedVideo = unstable_cache(
    async (targetId) => {
      try {
        let video = null;

        // A. Try MongoDB first
        try {
          await connectDB();
          const db = mongoose.connection.db;
          const videoCollection = db.collection("bhaicharas");

          if (mongoose.Types.ObjectId.isValid(targetId)) {
            video = await videoCollection.findOne({
              _id: new mongoose.Types.ObjectId(targetId),
            });
          }

          if (!video) {
            video = await videoCollection.findOne({ id: targetId });
          }

          if (!video) {
            video = await videoCollection.findOne({ videoId: targetId });
          }
        } catch (dbErr) {
          console.error("DB lookup in getVideoById:", dbErr.message);
        }

        if (video) {
          return normalizeVideo(video);
        }

        // B. If not in DB, fetch from external API: https://xxxtv.top/api/videos/{id}
        try {
          const res = await fetch(
            `https://xxxtv.top/api/videos/${encodeURIComponent(targetId)}`,
            {
              next: { revalidate: 300 },
            },
          );

          if (res.ok) {
            const apiData = await res.json();
            const item = apiData?.data || (apiData?.id ? apiData : null);
            if (item) {
              return normalizeApiVideo(item);
            }
          }
        } catch (apiErr) {
          console.error("External API lookup in getVideoById:", apiErr.message);
        }

        return null;
      } catch (error) {
        console.error("Failed to fetch video by ID:", error);
        return null;
      }
    },
    [`video-detail-${id}-${BUILD_ID}`],
    {
      revalidate: 180,
      tags: ["video-detail"],
    },
  );

  return fetchCachedVideo(id);
};

// 3. Recommended videos (separate recommendations for Explore vs MongoDB)
export const getRecommendedVideos = async (
  currentId,
  limit = 12,
  isExplore = false,
) => {
  const fetchCachedRecommendations = unstable_cache(
    async (cId, lmt, isExp) => {
      // If viewing an Explore video, suggest ONLY Explore videos
      if (isExp) {
        try {
          const exploreData = await ExploreVideos({ page: 1, limit: lmt + 4 });
          return (exploreData?.fetchedVideos || [])
            .filter(
              (v) =>
                String(v._id) !== String(cId) && String(v.id) !== String(cId),
            )
            .slice(0, lmt);
        } catch (exploreErr) {
          console.error("Failed to fetch explore recommendations:", exploreErr);
          return [];
        }
      }

      // Otherwise (MongoDB video), suggest ONLY MongoDB videos
      try {
        await connectDB();
        const db = mongoose.connection.db;
        const videoCollection = db.collection("bhaicharas");

        const query = {};
        if (cId && mongoose.Types.ObjectId.isValid(cId)) {
          query._id = { $ne: new mongoose.Types.ObjectId(cId) };
        } else if (cId) {
          query.id = { $ne: cId };
        }

        const rawVideos = await videoCollection
          .aggregate([{ $match: query }, { $sample: { size: lmt } }])
          .toArray();

        return rawVideos.map(normalizeVideo);
      } catch (error) {
        console.error("Failed to fetch DB recommendations:", error);
        return [];
      }
    },
    [
      `recommended-videos-${currentId}-${limit}-${isExplore ? "explore" : "db"}-${BUILD_ID}`,
    ],
    {
      revalidate: 180,
      tags: ["recommendations"],
    },
  );

  return fetchCachedRecommendations(currentId, limit, isExplore);
};

// 4. Direct DB connection for random home videos (cached for 30 minutes / 1800s)
export const getRandomHomeVideos = async (limit = 30) => {
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
      revalidate: 1800, // Cache for 30 minutes
      tags: ["random-videos", "home-videos"],
    },
  );

  return fetchCachedRandom(limit);
};

// 5. Explore videos from external API (https://xxxtv.top/api/videos/latest)
export const ExploreVideos = async ({ page = 1, limit = 40 } = {}) => {
  try {
    const res = await fetch(
      `https://xxxtv.top/api/videos/latest?page=${page}&limit=${limit}`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!res.ok) {
      console.error(`ExploreVideos API responded with status ${res.status}`);
      return {
        fetchedVideos: [],
        totalPages: 1,
        totalVideos: 0,
      };
    }

    const data = await res.json();
    const rawList = Array.isArray(data?.data) ? data.data : [];
    const fetchedVideos = rawList.map(normalizeApiVideo);

    return {
      fetchedVideos,
      totalPages: data?.totalPages || 1,
      totalVideos: data?.totalVideos || fetchedVideos.length,
      page: data?.page || page,
      limit: data?.limit || limit,
    };
  } catch (error) {
    console.error("Failed to fetch ExploreVideos from xxxtv.top API:", error);
    return {
      fetchedVideos: [],
      totalPages: 1,
      totalVideos: 0,
    };
  }
};

export const ExploreVideo = ExploreVideos;

// 6. Main component
const FetchVideo = async ({
  page = 1,
  limit = 40,
  data = null,
  isHome = false,
}) => {
  const videos = data ?? (await getVideoPage({ page, limit })).fetchedVideos;

  return React.createElement(
    "div",
    { className: "w-full" },
    React.createElement(CardContiner, {
      data: videos,
      title: isHome ? "Explore" : `Page ${page} Results`,
      showToggle: true,
    }),
  );
};

export default FetchVideo;
