// app/sitemap.js

import { connectDB } from "@/lib/mongooseConnect";
import mongoose from "mongoose";

// Cache/revalidate the generated sitemap every 12 hours (43,200 seconds)
export const revalidate = 43200;

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.leaftv.fun"; // match real domain

  // Helper function to create clean, SEO-friendly slugs
  const slugify = (text) =>
    text
      ? String(text)
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-")
      : "video";

  // 1. Static Pages
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // 2. Dynamic Video Routes
  let postRoutes = [];

  try {
    await connectDB();
    const db = mongoose.connection.db;
    const videoCollection = db.collection("bhaicharas");

    // OPTIMIZATION: Projection retrieves ONLY _id, title, and updatedAt fields
    // This reduces payload memory overhead and makes the DB query instant
    const rawVideos = await videoCollection
      .find({}, { projection: { _id: 1, title: 1, name: 1, updatedAt: 1 } })
      .toArray();

    postRoutes = rawVideos.map((video) => {
      const id = video._id.toString();
      const slug = slugify(video.title || video.name);

      return {
        url: `${baseUrl}/post/${id}/${slug}`,
        lastModified: video.updatedAt ? new Date(video.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  // Combine static and dynamic routes
  return [...staticRoutes, ...postRoutes];
}
