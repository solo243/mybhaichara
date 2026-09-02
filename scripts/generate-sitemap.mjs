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

function parseDurationSeconds(duration) {
  if (typeof duration === "number" && !isNaN(duration) && duration > 0) {
    return Math.floor(duration);
  }
  if (!duration || typeof duration !== "string") return undefined;
  const parts = duration.split(":").map(Number);
  if (parts.some(isNaN)) return undefined;

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return undefined;
}

// Helper to safely escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchExploreVideos(maxPages = 10) {
  console.log(`Fetching Explore videos from external API (up to ${maxPages} pages)...`);
  const exploreVideos = [];

  try {
    for (let page = 1; page <= maxPages; page++) {
      try {
        const res = await fetch(
          `https://xxxtv.top/api/videos/latest?page=${page}&limit=50`,
          { headers: { "User-Agent": "Leaftv-Sitemap-Builder/1.0" } },
        );
        if (!res.ok) break;

        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        if (list.length === 0) break;

        for (const item of list) {
          exploreVideos.push({
            _id: String(item.id),
            id: String(item.id),
            title: item.title || "Video",
            img_url: item.thumbnail || "",
            thumbnail: item.thumbnail || "",
            preview: item.preview || "",
            duration: item.duration,
            createdAt: item.createdAt || new Date().toISOString(),
            isExplore: true,
          });
        }

        if (page >= (json.totalPages || 1)) break;
      } catch (pageErr) {
        console.warn(`Warning: Failed to fetch Explore page ${page}:`, pageErr.message);
        break;
      }
    }
    console.log(`Fetched ${exploreVideos.length} Explore videos from API.`);
  } catch (err) {
    console.error("Failed to fetch explore videos for sitemap:", err.message);
  }

  return exploreVideos;
}

async function generate() {
  console.log("Connecting to MongoDB to fetch videos for static sitemaps...");
  const videoMap = new Map();

  // 1. Fetch MongoDB Videos
  try {
    if (MONGODB_URI) {
      await mongoose.connect(MONGODB_URI);
      const db = mongoose.connection.db;
      const collection = db.collection("bhaicharas");

      const dbVideos = await collection.find({}).toArray();
      console.log(`Fetched ${dbVideos.length} videos from MongoDB.`);
      for (const v of dbVideos) {
        const key = v._id ? v._id.toString() : String(v.id || "");
        if (key) videoMap.set(key, v);
      }
      await mongoose.disconnect();
    }
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }

  // Fallback to Data.json if DB has 0 videos
  if (videoMap.size === 0) {
    const dataJsonPath = path.resolve("./Data.json");
    if (fs.existsSync(dataJsonPath)) {
      const fileVideos = JSON.parse(fs.readFileSync(dataJsonPath, "utf8"));
      for (const v of fileVideos) {
        const key = v._id ? v._id.toString() : String(v.id || "");
        if (key) videoMap.set(key, v);
      }
      console.log(`Fallback: Loaded ${videoMap.size} videos from Data.json.`);
    }
  }

  // 2. Fetch Explore API Videos
  const exploreList = await fetchExploreVideos(10);
  for (const exp of exploreList) {
    const key = exp.id || exp._id;
    if (key && !videoMap.has(key)) {
      videoMap.set(key, exp);
    }
  }

  const allVideos = Array.from(videoMap.values());
  console.log(`Total unique videos for sitemap: ${allVideos.length}`);

  const publicDir = path.resolve("./public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 3. Generate Standard sitemap.xml
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
    <loc>${SITE_URL}/mms</loc>
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

  const videoUrls = allVideos.map((video) => {
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
  console.log(`Created public/sitemap.xml with ${staticUrls.length + videoUrls.length} total URLs.`);

  // 4. Generate Google Video video-sitemap.xml
  const videoEntries = allVideos.map((video) => {
    const id = video._id ? video._id.toString() : String(video.id || "");
    const title = video.title || "Free Video";
    const slug = slugify(title);
    const pageUrl = `${SITE_URL}/post/${id}/${slug}`;
    const thumbnailUrl =
      video.img_url || video.homepage_thumbnail || video.thumbnail || `${SITE_URL}/ogimg.png`;

    const directVideos =
      (video.videos && video.videos.length > 0 ? video.videos : null) ||
      video.extracted_media?.direct_videos ||
      (video.preview ? [video.preview] : []);

    const contentUrl = directVideos[0] || "";
    const rawDate = video.createdAt || video.updatedAt || new Date();
    const pubDate = new Date(rawDate).toISOString();
    const durationSec = parseDurationSeconds(video.duration);

    return `  <url>
    <loc>${pageUrl}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(thumbnailUrl)}</video:thumbnail_loc>
      <video:title><![CDATA[${title}]]></video:title>
      <video:description><![CDATA[Watch ${title} on Leaftv with high quality streaming.]]></video:description>
      ${contentUrl ? `<video:content_loc>${escapeXml(contentUrl)}</video:content_loc>` : ""}
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
  console.log(`Created public/video-sitemap.xml with ${videoEntries.length} video entries.`);
}

generate().catch(console.error);
