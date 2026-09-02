import React from "react";
import Link from "next/link";
import { Compass, Flame, ArrowRight, Sparkles } from "lucide-react";

const HomeSectionSelector = () => {
  return (
    <div className="w-full my-6 px-4 select-none">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
          {/* <Sparkles className="w-3.5 h-3.5 text-primary" /> */}
          <span>Browse By Category</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 1. Explore Section Option */}
        <Link
          href="/explore"
          className="group relative overflow-hidden  border border-neutral-800 p-4 sm:p-5  transition-all duration-300 "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3  transition-all">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-white  transition-colors">
                    Explore Videos
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5  bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Trending
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                  Latest releases white porn
                </p>
              </div>
            </div>
            <div className="p-2    transition-colors ml-2 shrink-0">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 s transition-all" />
            </div>
          </div>
        </Link>

        {/* 2. Leak Video Section Option */}
        <Link
          href="/mms"
          className="group relative overflow-hidden  border-neutral-800 border  p-4 sm:p-5  transition-all duration-300 hover:shadow-xl "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3      transition-all">
                <Flame className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-white  transition-colors">
                    Leak Video Section
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5  bg-primary/20 text-red-300 border border-primary/30">
                    Full MMS
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                  Exclusive desi viral leaks & MMS
                </p>
              </div>
            </div>
            <div className="p-2    transition-colors ml-2 shrink-0">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400  " />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomeSectionSelector;
