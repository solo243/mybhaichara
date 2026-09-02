import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import CardContiner from "@/components/CardContiner";
import PaginationButtons from "@/components/PaginationButton";
import TrendingKeywords from "@/components/TrendingKeywords";
import { getVideoPage } from "@/lib/FetchVideo";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  return {
    title:
      page > 1
        ? `Explore Videos - Page ${page} | Leaftv`
        : "Explore All Videos & MMS - Free HD Video Streaming | Leaftv",
    description:
      "Explore all videos, viral desi leaks, and exclusive MMS on Leaftv. Watch high quality streaming with full pagination.",
    alternates: {
      canonical: page > 1 ? `/explore?page=${page}` : "/explore",
    },
  };
}

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

const ExplorePage = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }

  const { fetchedVideos, totalPages, totalVideos } = await getVideoPage({
    page,
    limit: 40,
  });

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="max-w-7xl py-4 w-full mx-auto">
        <Suspense fallback={<LoadingGrid />}>
          <CardContiner
            data={fetchedVideos}
            title={page === 1 ? "Explore All Videos" : `Page ${page} Results`}
            showToggle={true}
          />
        </Suspense>

        {totalPages > 1 && (
          <div className="mt-12 text-center text-sm text-neutral-400">
            Page {page} of {totalPages || 1} • {totalVideos} videos
          </div>
        )}

        {totalPages > 1 && (
          <div className="pt-10 w-full">
            <PaginationButtons page={page} total_pages={totalPages || 1} />
          </div>
        )}

        {/* SEO Internal Linking Topics Hub */}
        <TrendingKeywords
          title="Trending Topics & Categories"
          description="Browse trending desi models, full HD viral leaks, and popular video collections on Leaftv."
          videos={fetchedVideos}
        />
      </div>
    </div>
  );
};

export default ExplorePage;
