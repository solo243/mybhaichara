import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("url");
  const shouldDownload =
    searchParams.get("download") === "1" ||
    searchParams.get("download") === "true";
  const requestedFilename = searchParams.get("filename") || "video.mp4";
  const safeFilename = requestedFilename.replace(/[^a-zA-Z0-9._-]/g, "_");

  if (!videoUrl) {
    return NextResponse.json(
      { success: false, error: "Missing video url" },
      { status: 400 },
    );
  }

  try {
    const target = new URL(videoUrl);

    if (!["http:", "https:"].includes(target.protocol)) {
      return NextResponse.json(
        { success: false, error: "Only http(s) video URLs are allowed" },
        { status: 400 },
      );
    }

    const upstreamResponse = await fetch(target.toString(), {
      headers: {
        range: request.headers.get("range") || "",
      },
      redirect: "follow",
    });

    if (!upstreamResponse.ok && upstreamResponse.status !== 206) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch video from upstream" },
        { status: upstreamResponse.status },
      );
    }

    const headers = new Headers();
    const contentType = upstreamResponse.headers.get("content-type");
    const contentLength = upstreamResponse.headers.get("content-length");
    const contentRange = upstreamResponse.headers.get("content-range");
    const acceptRanges = upstreamResponse.headers.get("accept-ranges");

    if (contentType) headers.set("content-type", contentType);
    if (contentLength) headers.set("content-length", contentLength);
    if (contentRange) headers.set("content-range", contentRange);
    if (acceptRanges) headers.set("accept-ranges", acceptRanges);

    if (shouldDownload) {
      headers.set(
        "content-disposition",
        `attachment; filename="${safeFilename}"`,
      );
    }

    headers.set("cache-control", "public, max-age=3600");
    headers.set("access-control-allow-origin", "*");
    headers.set("access-control-allow-headers", "range");

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers,
    });
  } catch (error) {
    console.error("Video proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to proxy video" },
      { status: 502 },
    );
  }
}
