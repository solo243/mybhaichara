"use client";

import { Download } from "lucide-react";

export default function DownloadButton({ videoUrl, filename }) {
  const handleDownload = async () => {
    try {
      // Fetches directly from the source to the user's browser
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      // Creates a hidden link to trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "video.mp4";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center rounded bg-red-600 px-4 py-2 text-sm font-medium text-white gap-2 transition hover:bg-red-700"
    >
      <Download size={18} />
      Download Video
    </button>
  );
}
