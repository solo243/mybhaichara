import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

import FetchVideo from "@/lib/FetchVideo";

export const revalidate = 3600;

const Home = async () => {
  return (
    <main className="min-h-screen max-w-7xl mx-auto">
      <div className="items-center flex flex-col">
        <div className="md:text-5xl text-[26px] font-semibold text-center md:font-semibold mt-10 md:mt-12">
          Welcome to the Bhaichara
        </div>
        <div className="text-center md:mt-2 mt-1 text-neutral-400 max-w-lg mx-auto">
          Discover Exclusive Nude Videos and Premium Collections from Top Desi
          Models - 100% Free
        </div>
        <Link
          href={"/explore"}
          className="text-lg cursor-pointer font-medium hover:shadow-[-7px_7px_0px_#242424] bg-white text-black px-8 py-2.5 mt-6 flex items-center hover:bg-yellowColor mx-auto"
        >
          Explore
          <ArrowRight />
        </Link>
      </div>

      <div className="md:mt-14 mt-12">
        <h1 className="md:text-4xl pb-6 text-[24px] font-semibold ">
          Trending Videos
        </h1>
      </div>

      {/* 4. Pass the database videos to the CardContainer */}
      <Suspense
        fallback={
          <div className="text-white text-center mt-10">Loading videos...</div>
        }
      >
        <FetchVideo page={1} limit={20} />
      </Suspense>
    </main>
  );
};

export default Home;
