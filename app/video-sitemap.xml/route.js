import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongooseConnect";
import { slugify } from "@/lib/utils";

export const revalidate = 43200; // Cache for 12 hours
export const runtime = "nodejs";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://leaftv.fun"
).replace(/\/$/, "");

// Helper to convert "04:30" or "01:15:00" to total seconds for Google Video Sitemap
function parseDurationSeconds(durationStr) {
  if (!durationStr || typeof durationStr !== "string") return undefined;
  const parts = durationStr.split(":").map(Number);
  if (parts.some(isNaN)) return undefined;

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return undefined;
}

export async function GET() {
  let videoEntries = [];

  try {
    await connectDB();
    const db = mongoose.connection.db;
    const videoCollection = db.collection("bhaicharas");

    const rawVideos = await videoCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            id: 1,
            title: 1,
            img_url: 1,
            homepage_thumbnail: 1,
            duration: 1,
            videos: 1,
            extracted_media: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      )
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(10000)
      .toArray();

    videoEntries = rawVideos
      .map((video) => {
        const id = video._id ? video._id.toString() : String(video.id || "");
        if (!id) return null;

        const title = video.title || "Free Video";
        const slug = slugify(title);
        const pageUrl = `${SITE_URL}/post/${id}/${slug}`;
        const thumbnailUrl =
          video.img_url || video.homepage_thumbnail || `${SITE_URL}/ogimg.png`;

        const directVideos =
          (video.videos && video.videos.length > 0 ? video.videos : null) ||
          video.extracted_media?.direct_videos ||
          [];
        const contentUrl = directVideos[0] || "";

        const rawDate = video.createdAt || video.updatedAt;
        const pubDate = rawDate
          ? new Date(rawDate).toISOString()
          : new Date().toISOString();
        const durationSeconds = parseDurationSeconds(video.duration);

        return `
    <url>
      <loc>${pageUrl}</loc>
      <video:video>
        <video:thumbnail_loc>${thumbnailUrl}</video:thumbnail_loc>
        <video:title><![CDATA[${title}]]></video:title>
        <video:description><![CDATA[Watch ${title} on Leaftv with high quality video streaming.]]></video:description>
        ${contentUrl ? `<video:content_loc>${contentUrl}</video:content_loc>` : ""}
        <video:player_loc>${pageUrl}</video:player_loc>
        ${durationSeconds ? `<video:duration>${durationSeconds}</video:duration>` : ""}
        <video:publication_date>${pubDate}</video:publication_date>
        <video:family_friendly>no</video:family_friendly>
      </video:video>
    </url>`;
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Video sitemap generation error:", error);
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${videoEntries.join("")}
</urlset>`;

  return new NextResponse(sitemapXml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=43200, s-maxage=43200, stale-while-revalidate=86400",
    },
  });
}
