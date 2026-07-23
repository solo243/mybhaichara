import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

import CardContiner from "@/components/CardContiner";
import { getRandomHomeVideos } from "@/lib/FetchVideo";

const Home = async () => {
  // const getRandomHomeVideos = [];
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

      <Suspense
        fallback={
          <div className="text-white text-center mt-10">Loading videos...</div>
        }
      >
        <HomeVideos />
      </Suspense>

      <div className=" w-full flex items-center mx-auto">
        <Link
          href={"/explore"}
          className="text-lg bg-neutral-900 px-10 py-2 font-semibold w-fit mx-auto mt-8 cursor-pointer hover:border-accent border border-neutral-900"
        >
          Show more
        </Link>
      </div>
    </main>
  );
};

async function HomeVideos() {
  const videos = await getRandomHomeVideos(20);

  return <CardContiner data={videos} />;
}

export default Home;
