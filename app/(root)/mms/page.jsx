import React, { Suspense } from "react";
import { notFound } from "next/navigation";
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
        ? `Leak Videos & MMS - Page ${page} | Leaftv`
        : "Leak Videos & MMS - Watch Viral Desi Leaks Free | Leaftv",
    description:
      "Watch exclusive viral leaks, desi MMS, and high-definition leaked videos for free without registration on Leaftv.",
    alternates: {
      canonical: page > 1 ? `/mms?page=${page}` : "/mms",
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

async function MmsGrid({ page, limit = 40 }) {
  const { fetchedVideos } = await getVideoPage({ page, limit });
  return (
    <CardContiner
      data={fetchedVideos}
      showToggle={true}
      title={
        page === 1
          ? "Exclusive Leak Videos & MMS"
          : `Leak Videos - Page ${page}`
      }
    />
  );
}

const LeakVideos = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }

  const { totalPages, totalVideos } = await getVideoPage({
    page,
    limit: 40,
  });

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="max-w-7xl py-4 w-full mx-auto">
        <Suspense key={page} fallback={<LoadingGrid />}>
          <MmsGrid page={page} limit={40} />
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

        {/* SEO Topics Hub */}
        <TrendingKeywords
          title="Popular MMS & Viral Topics"
          description="Explore top desi leaks, viral trending topics, and exclusive video clips on Leaftv."
        />
      </div>
    </div>
  );
};

export default LeakVideos;
