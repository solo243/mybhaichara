// // app/sitemap.js

// import { connectDB } from "@/lib/mongooseConnect";
// import mongoose from "mongoose";

// // Cache/revalidate the generated sitemap every 12 hours (43,200 seconds)
// export const revalidate = 43200;

// export default async function sitemap() {
//   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://leaftv.fun";

//   // Helper function to create clean, SEO-friendly slugs
//   const slugify = (text) =>
//     text
//       ? String(text)
//           .toLowerCase()
//           .trim()
//           .replace(/\s+/g, "-")
//           .replace(/[^a-z0-9-]/g, "")
//           .replace(/-+/g, "-")
//       : "video";

//   // 1. Static Pages
//   const staticRoutes = [
//     {
//       url: `${baseUrl}`,
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 1.0,
//     },
//     {
//       url: `${baseUrl}/about`,
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.4,
//     },
//   ];

//   // 2. Dynamic Video Routes
//   let postRoutes = [];

//   try {
//     await connectDB();
//     const db = mongoose.connection.db;
//     const videoCollection = db.collection("bhaicharas");

//     // Fetch up to 10,000 most recent videos (prevents DB timeouts)
//     const rawVideos = await videoCollection
//       .find(
//         {},
//         {
//           projection: { _id: 1, title: 1, name: 1, updatedAt: 1, createdAt: 1 },
//         },
//       )
//       .sort({ updatedAt: -1, createdAt: -1 })
//       .limit(10000)
//       .toArray();

//     postRoutes = rawVideos.map((video) => {
//       const id = video._id.toString();
//       const slug = slugify(video.title || video.name);

//       // Preferred date order: updatedAt -> createdAt -> now
//       const rawDate = video.updatedAt || video.createdAt;
//       const lastModDate = rawDate ? new Date(rawDate) : new Date();

//       return {
//         url: `${baseUrl}/post/${id}/${slug}`,
//         lastModified: isNaN(lastModDate.getTime()) ? new Date() : lastModDate,
//         changeFrequency: "weekly",
//         priority: 0.8,
//       };
//     });
//   } catch (error) {
//     console.error("Sitemap generation error:", error);
//   }

//   // Combine static and dynamic routes
//   return [...staticRoutes, ...postRoutes];
// }

import { connectDB } from "@/lib/mongooseConnect";
import mongoose from "mongoose";

// Cache/revalidate the generated sitemap every 12 hours (43,200 seconds)
export const revalidate = 43200;
export const runtime = "nodejs";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://leaftv.fun")
  .replace(/\/$/, "");

const slugify = (text) =>
  text
    ? String(text)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "video";

export default async function sitemap() {
  // 1. Static Pages
  const staticRoutes = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
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

    // Fetch up to 10,000 most recent videos (prevents DB timeouts)
    const rawVideos = await videoCollection
      .find(
        {},
        {
          projection: { _id: 1, title: 1, name: 1, updatedAt: 1, createdAt: 1 },
        },
      )
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(10000)
      .toArray();

    postRoutes = rawVideos.map((video) => {
      const id = video._id.toString();
      const slug = slugify(video.title || video.name);

      // Preferred date order: updatedAt -> createdAt -> now
      const rawDate = video.updatedAt || video.createdAt;
      const lastModDate = rawDate ? new Date(rawDate) : new Date();

      return {
        url: `${SITE_URL}/post/${id}/${slug}`,
        // Omit an invalid database date instead of publishing a misleading
        // changing timestamp that causes unnecessary recrawls.
        ...(Number.isNaN(lastModDate.getTime()) ? {} : { lastModified: lastModDate }),
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });
  } catch (error) {
    // Keep the sitemap available to crawlers even during a database outage.
    console.error("Sitemap video URL generation error:", error);
  }

  // Combine static and dynamic routes
  return [...staticRoutes, ...postRoutes];
}
