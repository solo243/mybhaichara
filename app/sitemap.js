import { connectDB } from "@/lib/mongooseConnect";
import mongoose from "mongoose";
import { slugify } from "@/lib/utils";

// Revalidate the sitemap every 12 hours (43,200 seconds)
export const revalidate = 43200;
export const runtime = "nodejs";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://leaftv.fun").replace(
  /\/$/,
  "",
);

export default async function sitemap() {
  // 1. Static Routes
  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 2. Dynamic Video Routes
  let postRoutes = [];

  try {
    await connectDB();
    const db = mongoose.connection.db;
    const videoCollection = db.collection("bhaicharas");

    // Fetch up to 10,000 most recent videos
    const rawVideos = await videoCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            id: 1,
            title: 1,
            name: 1,
            updatedAt: 1,
            createdAt: 1,
          },
        },
      )
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(10000)
      .toArray();

    postRoutes = rawVideos
      .map((video) => {
        const id = video._id ? video._id.toString() : String(video.id || "");
        if (!id) return null;

        const slug = slugify(video.title || video.name);
        const rawDate = video.updatedAt || video.createdAt;
        const lastModDate = rawDate ? new Date(rawDate) : new Date();

        return {
          url: `${SITE_URL}/post/${id}/${slug}`,
          ...(Number.isNaN(lastModDate.getTime())
            ? {}
            : { lastModified: lastModDate }),
          changeFrequency: "weekly",
          priority: 0.8,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Sitemap video URL generation error:", error);
  }

  return [...staticRoutes, ...postRoutes];
}
