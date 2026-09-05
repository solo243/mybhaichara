import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.production" });
dotenv.config({ path: ".env" });

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://leaftv.fun"
).replace(/\/$/, "");
const MONGODB_URI = process.env.MONGODB_URI;

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

async function generate() {
  let videos = [];

  try {
    if (MONGODB_URI) {
      await mongoose.connect(MONGODB_URI);
      const client = mongoose.connection.client;

      // 1. Fetch all videos from test.bhaicharas
      const testDb = client.db("test");
      const bhaicharaDocs = await testDb
        .collection("bhaicharas")
        .find({})
        .toArray();

      // 2. Fetch all videos from leaftv.leaftv
      const leaftvDb = client.db("leaftv");
      const leaftvDocs = await leaftvDb.collection("leaftv").find({}).toArray();

      // Combine and deduplicate videos by ID/title
      const seen = new Set();
      const combined = [];

      for (const v of [...bhaicharaDocs, ...leaftvDocs]) {
        const idKey = v.videoId || v.id || (v._id ? v._id.toString() : "");
        const titleKey = v.title || "";
        const uniqueKey = idKey || titleKey;
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          combined.push(v);
        }
      }

      videos = combined;

      // Update Data.json with the newest MongoDB data
      if (videos.length > 0) {
        const dataJsonPath = path.resolve("./Data.json");
        fs.writeFileSync(dataJsonPath, JSON.stringify(videos, null, 2), "utf8");
      }

      await mongoose.disconnect();
    }
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }

  // Fallback to Data.json if database fetch returned nothing
  if (videos.length === 0) {
    const dataJsonPath = path.resolve("./Data.json");
    if (fs.existsSync(dataJsonPath)) {
      videos = JSON.parse(fs.readFileSync(dataJsonPath, "utf8"));
    }
  }

  const publicDir = path.resolve("./public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Generate Standard sitemap.xml
  const staticUrls = [
    `  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    `  <url>
    <loc>${SITE_URL}/explore</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`,
    `  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`,
  ];

  const videoUrls = videos.map((video) => {
    const id =
      video.id !== undefined && video.id !== null
        ? String(video.id)
        : video._id
          ? video._id.toString()
          : "";
    const title = video.title || "video";
    const slug = slugify(title);
    const rawDate = video.updatedAt || video.createdAt || new Date();
    const lastMod = new Date(rawDate).toISOString();

    return `  <url>
    <loc>${SITE_URL}/post/${id}/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join("\n")}
${videoUrls.join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");

  // 2. Generate Google Video video-sitemap.xml
  const videoEntries = videos.map((video) => {
    const id =
      video.id !== undefined && video.id !== null
        ? String(video.id)
        : video._id
          ? video._id.toString()
          : "";
    const title = video.title || "Free Video";
    const slug = slugify(title);
    const pageUrl = `${SITE_URL}/post/${id}/${slug}`;
    const thumbnailUrl =
      video.img_url ||
      video.imgurl ||
      video.homepage_thumbnail ||
      `${SITE_URL}/ogimg.png`;

    let directVideos = [];
    if (Array.isArray(video.videos)) {
      directVideos.push(...video.videos.filter(Boolean));
    } else if (typeof video.videos === "string" && video.videos.trim()) {
      directVideos.push(video.videos.trim());
    }

    if (Array.isArray(video.video)) {
      directVideos.push(...video.video.filter(Boolean));
    } else if (typeof video.video === "string" && video.video.trim()) {
      directVideos.push(video.video.trim());
    }

    if (Array.isArray(video.extracted_media?.direct_videos)) {
      directVideos.push(...video.extracted_media.direct_videos.filter(Boolean));
    }

    const contentUrl = directVideos[0] || "";
    const rawDate = video.createdAt || video.updatedAt || new Date();
    const pubDate = new Date(rawDate).toISOString();
    const durationSec = parseDurationSeconds(video.duration);

    return `  <url>
    <loc>${pageUrl}</loc>
    <video:video>
      <video:thumbnail_loc>${thumbnailUrl}</video:thumbnail_loc>
      <video:title><![CDATA[${title}]]></video:title>
      <video:description><![CDATA[Watch ${title} on Leaftv with high quality streaming.]]></video:description>
      ${contentUrl ? `<video:content_loc>${contentUrl}</video:content_loc>` : ""}
      <video:player_loc>${pageUrl}</video:player_loc>
      ${durationSec ? `<video:duration>${durationSec}</video:duration>` : ""}
      <video:publication_date>${pubDate}</video:publication_date>
      <video:family_friendly>no</video:family_friendly>
    </video:video>
  </url>`;
  });

  const videoSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoEntries.join("\n")}
</urlset>`;

  fs.writeFileSync(
    path.join(publicDir, "video-sitemap.xml"),
    videoSitemapXml,
    "utf8",
  );
}

generate().catch(console.error);
