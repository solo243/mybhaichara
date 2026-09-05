import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongooseConnect";
import { escapeRegex } from "@/lib/utils";

const mapVideoRecord = (video) => {
  if (!video) return null;
  const directVideos =
    (video.videos && Array.isArray(video.videos) && video.videos.length > 0
      ? video.videos
      : null) ||
    video.extracted_media?.direct_videos ||
    [];

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
  };
};

export async function GET(request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const videoCollection = db.collection("leaftv");

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videos");
    const query = (searchParams.get("query") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
    const limit = Math.max(
      1,
      Math.min(50, parseInt(searchParams.get("limit"), 10) || 10),
    );

    const headers = {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    };

    // 1. Single video lookup
    if (videoId) {
      const singleQuery = mongoose.isValidObjectId(videoId)
        ? {
            $or: [
              { _id: new mongoose.Types.ObjectId(videoId) },
              { id: videoId },
              { videoId: videoId },
            ],
          }
        : {
            $or: [{ _id: videoId }, { id: videoId }, { videoId: videoId }],
          };

      const video = await videoCollection.findOne(singleQuery);

      return NextResponse.json(
        {
          success: true,
          video: mapVideoRecord(video),
        },
        { status: 200, headers },
      );
    }

    // 2. Search query with safe escaped regex
    if (query) {
      const searchLimit = Math.min(limit, 20);
      const safePattern = escapeRegex(query);
      const searchRegex = new RegExp(safePattern, "i");

      const matchedVideos = await videoCollection
        .find({
          $or: [
            { title: { $regex: searchRegex } },
            { videoId: { $regex: searchRegex } },
            { id: { $regex: searchRegex } },
          ],
        })
        .limit(searchLimit)
        .toArray();

      return NextResponse.json(
        {
          success: true,
          data: matchedVideos.map(mapVideoRecord),
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: matchedVideos.length,
            itemsPerPage: searchLimit,
          },
        },
        { status: 200, headers },
      );
    }

    // 3. Paginated listing
    const skip = (page - 1) * limit;
    const [videos, totalVideos] = await Promise.all([
      videoCollection.find({}).skip(skip).limit(limit).toArray(),
      videoCollection.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalVideos / limit) || 1;

    return NextResponse.json(
      {
        success: true,
        data: videos.map(mapVideoRecord),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalVideos,
          itemsPerPage: limit,
        },
      },
      { status: 200, headers },
    );
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}
