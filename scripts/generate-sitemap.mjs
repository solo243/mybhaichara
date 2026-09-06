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
  console.log("Connecting to MongoDB to fetch videos for static sitemaps...");
  let videos = [];

  try {
    if (MONGODB_URI) {
      await mongoose.connect(MONGODB_URI);
      const db = mongoose.connection.db;
      const collection = db.collection("bhaicharas");

      videos = await collection.find({}).toArray();
      console.log(`Fetched ${videos.length} videos from MongoDB.`);
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
      console.log(`Fallback: Loaded ${videos.length} videos from Data.json.`);
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
    const id = video._id ? video._id.toString() : String(video.id || "");
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
  console.log("Created public/sitemap.xml");

  // 2. Generate Google Video video-sitemap.xml
  const videoEntries = videos.map((video) => {
    const id = video._id ? video._id.toString() : String(video.id || "");
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
  console.log("Created public/video-sitemap.xml");
}

generate().catch(console.error);
