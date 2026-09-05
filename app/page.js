import React from "react";
import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import CardContiner from "@/components/CardContiner";
import { getRandomHomeVideos } from "@/lib/FetchVideo";
import HomeHeroActions from "@/components/HomeHeroActions";
import TrendingKeywords from "@/components/TrendingKeywords";

export const revalidate = 1400; // 30 minutes cache

export const metadata = {
  title: "Leaftv - Watch Desi Leaks, MMS and Videos for free",
  description:
    "Watch Desi Videos, Leaks and MMS for free on Leaftv without signup desi leaks and bhabhi chudai videos and viral reel and viral leaks",
  alternates: {
    canonical: "/",
  },
};

const Home = async () => {
  const randomVideos = await getRandomHomeVideos(36);

  return (
    <div className="min-h-screen w-full flex">
      <div className="max-w-7xl py-4 w-full mx-auto">
        <div className="mb-8 text-center flex items-center flex-col pt-2 pb-6 px-1 border-b border-border/40">
          <h1 className="text-3xl sm:text-3xl md:text-4xl max-md:px-6 font-extrabold text-text-primary tracking-tight">
            <span className="text-primary"> Leaftv </span>
            Watch nude videos and MMS for free
          </h1>
          <h2 className="mt-1.5 text-base sm:text-sm md:text-base text-neutral-400 max-w-2xl leading-relaxed">
            Discover Exclusive Nude Videos and Premium Collections from Top Desi
            Models - 100% Free.
          </h2>

          {/* Quick Hero Actions: Surprise Me & Share Leaftv */}
          <HomeHeroActions videos={randomVideos} />
        </div>

        {/* 34 Random Videos Grid */}
        <CardContiner
          data={randomVideos}
          title="Featured Videos"
          showToggle={true}
        />

        {/* Explore All Videos with Pagination Link */}
        <div className="mt-12 flex justify-center px-4">
          <Link
            href="/explore"
            className="flex items-center gap-2 px-8 py-4 bg-surface hover:bg-surface-hover border border-border text-text-primary font-bold transition-all shadow-md hover:scale-[1.02] active:scale-95 text-base"
          >
            <Compass className="w-5 h-5 text-primary" />
            <span>Explore All Videos </span>
            <ArrowRight className="w-4 h-4 text-neutral-400" />
          </Link>
        </div>

        {/* SEO Internal Linking Topics Hub */}
        <TrendingKeywords
          title="Trending Searches & Popular Tags"
          description="Browse trending desi models, full HD viral leaks, and popular video collections on Leaftv."
          videos={randomVideos}
        />
      </div>
    </div>
  );
};

export default Home;
