import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import PaginationButtons from "@/components/PaginationButton";
import FetchVideo, { getVideoPage } from "@/lib/FetchVideo";
import HomeHeroActions from "@/components/HomeHeroActions";
import TrendingKeywords from "@/components/TrendingKeywords";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  return {
    title:
      page > 1
        ? `Leaftv - Page ${page} | Watch Desi Leaks, MMS and Videos for free `
        : undefined,
    description:
      "Watch Desi Videos , Leaks and MMS for free on Leaftv without signup desi leaks and bhabhi chudai videos and viral reel and viral leaks",

    alternates: {
      canonical: page > 1 ? `/?page=${page}` : "/",
    },
  };
}

const LoadingGrid = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
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

const Home = async ({ searchParams }) => {
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
    <div className="min-h-screen w-full flex">
      <div className="max-w-7xl py-4 w-full mx-auto">
        {page === 1 && (
          <div className="mb-8 text-center flex items-center flex-col pt-2 pb-6 px-1 border-b border-border/40">
            <h1 className="text-3xl sm:text-3xl md:text-4xl max-md:px-6 font-extrabold text-text-primary tracking-tight">
              <span className=" text-primary"> Leaftv </span>
              Watch nude videos and MMS for free
            </h1>
            <h2 className="mt-1.5 text-base sm:text-sm md:text-base text-neutral-400 max-w-2xl leading-relaxed">
              Discover Exclusive Nude Videos and Premium Collections from Top
              Desi Models - 100% Free.
            </h2>

            {/* Quick Hero Actions: Surprise Me & Share Leaftv */}
            <HomeHeroActions videos={fetchedVideos} />
          </div>
        )}

        <Suspense fallback={<LoadingGrid />}>
          <FetchVideo
            isHome={page === 1}
            limit={40}
            page={page}
            data={fetchedVideos}
          />
        </Suspense>

        <div className="mt-12 text-center text-sm text-neutral-400">
          Page {page} of {totalPages || 1} • {totalVideos} videos
        </div>

        <div className="pt-10 w-full">
          <PaginationButtons page={page} total_pages={totalPages || 1} />
        </div>

        {/* SEO Internal Linking Topics Hub */}
        <TrendingKeywords
          title="Trending Searches & Popular Tags"
          description="Browse trending desi models, full HD viral leaks, and popular video collections on Leaftv."
          videos={fetchedVideos}
        />
      </div>
    </div>
  );
};

export default Home;
