import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import PaginationButtons from "@/components/PaginationButton";
import FetchVideo, { getVideoPage } from "@/lib/FetchVideo";

const LoadingGrid = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse overflow-hidden rounded-xl bg-neutral-900"
      >
        <div className="h-48 bg-neutral-800" />
        <div className="space-y-3 p-4">
          <div className="h-4 w-3/4 rounded bg-neutral-800" />
          <div className="h-4 w-1/2 rounded bg-neutral-800" />
        </div>
      </div>
    ))}
  </div>
);

const Explore = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }

  const { fetchedVideos, totalPages, totalVideos } = await getVideoPage({
    page,
    limit: 20,
  });

  return (
    <main className="min-h-screen w-full flex">
      <div className="max-w-7xl py-4 w-full mx-auto">
        <Suspense fallback={<LoadingGrid />}>
          <FetchVideo limit={20} page={page} data={fetchedVideos} />
        </Suspense>

        <div className="mt-4 text-center text-sm text-neutral-400">
          Page {page} of {totalPages || 1} • {totalVideos} videos
        </div>

        <div className="pt-10 w-full">
          <PaginationButtons page={page} total_pages={totalPages || 1} />
        </div>
      </div>
    </main>
  );
};

export default Explore;
