import React, { Suspense } from "react";
import CardContiner from "@/components/CardContiner";
import PaginationButtons from "@/components/PaginationButton";
import { ExploreVideos } from "@/lib/FetchVideo";

export const metadata = {
  title: "Explore Latest & Trending Videos - Leaftv",
  description:
    "Explore the latest full HD video releases, trending viral clips, and exclusive updates on Leaftv.",
};

const LoadingGrid = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
    {Array.from({ length: 12 }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse overflow-hidden rounded-xl bg-background"
      >
        <div className="h-48 bg-neutral-800 rounded-lg" />
        <div className="space-y-3 p-4">
          <div className="h-4 w-3/4 rounded bg-neutral-800" />
          <div className="h-4 w-1/2 rounded bg-neutral-800" />
        </div>
      </div>
    ))}
  </div>
);

async function ExploreGrid({ page, limit = 40 }) {
  const { fetchedVideos } = await ExploreVideos({ page, limit });
  return (
    <CardContiner
      data={fetchedVideos}
      showToggle={true}
      title={page === 1 ? "Explore Trending Videos" : `Page ${page} Results`}
    />
  );
}

const Explore = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  const { totalPages, totalVideos } = await ExploreVideos({
    page,
    limit: 40,
  });

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="max-w-7xl py-4 w-full mx-auto">
        <Suspense key={page} fallback={<LoadingGrid />}>
          <ExploreGrid page={page} limit={40} />
        </Suspense>

        {totalPages > 1 && (
          <div className="mt-12 text-center text-sm text-neutral-400">
            Page {page} of {totalPages} • {totalVideos} videos
          </div>
        )}

        {totalPages > 1 && (
          <div className="pt-10 w-full">
            <PaginationButtons page={page} total_pages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
