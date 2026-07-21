"use client";

export default function DownloadButton({ videoUrl }) {
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      // Note: The 'download' attribute only works for same-origin files,
      // but adding it is good practice anyway.
      download
      className="inline-block px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Download / Open Video
    </a>
  );
}
