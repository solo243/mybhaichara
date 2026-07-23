import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongooseConnect";

export async function GET(request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const videoCollection = db.collection("mms");

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    if (videoId) {
      const query = mongoose.isValidObjectId(videoId)
        ? { _id: new mongoose.Types.ObjectId(videoId) }
        : { _id: videoId };

      const video = await videoCollection.findOne(query);

      return NextResponse.json(
        {
          success: true,
          video: video
            ? {
                ...video,
                _id: video._id.toString(),
              }
            : null,
        },
        { status: 200 },
      );
    }

    if (query.trim()) {
      const searchLimit = Math.min(limit, 10);
      const searchRegex = new RegExp(query.trim(), "i");
      const matchedVideos = await videoCollection
        .find({
          $or: [
            { title: { $regex: searchRegex } },
            { shareCode: { $regex: searchRegex } },
          ],
        })
        .limit(searchLimit)
        .toArray();

      return NextResponse.json(
        {
          success: true,
          data: matchedVideos.map((video) => ({
            ...video,
            _id: video._id.toString(),
          })),
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: matchedVideos.length,
            itemsPerPage: searchLimit,
          },
        },
        { status: 200 },
      );
    }

    const skip = (page - 1) * limit;
    const videos = await videoCollection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalVideos = await videoCollection.countDocuments();
    const totalPages = Math.ceil(totalVideos / limit);

    return NextResponse.json(
      {
        success: true,
        data: videos.map((video) => ({
          ...video,
          _id: video._id.toString(),
        })),
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalVideos,
          itemsPerPage: limit,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}
