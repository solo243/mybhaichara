import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { slugify } from "@/lib/utils";

const Card = ({ data, isDense = false }) => {
  const postData = {
    title: data?.title || "Title is not available",
    img_url: data?.img_url || data?.homepage_thumbnail || "",
    duration: data?.duration || "NA",
    videoId: data?.videoId || data?.id || "NA",
    _id: data?._id || data?.id || "",
  };

  const slug = slugify(postData.title);

  return (
    <Link
      href={`/post/${postData._id}/${slug}`}
      className="group mb-2 sm:mb-4 cursor-pointer block w-full overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-surface ">
        {postData.img_url ? (
          <Image
            src={postData.img_url}
            alt={postData.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-neutral-800 to-neutral-900 text-xs sm:text-sm font-medium text-neutral-400">
            No preview available
          </div>
        )}

        <span className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 rounded bg-black/80 px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-text-primary backdrop-blur-sm">
          {postData.duration}
        </span>
      </div>

      <div className="mt-1.5 sm:mt-2 max-md:px-1 py-0.5 sm:py-1">
        <div
          className={`line-clamp-2 font-semibold text-text-primary transition-colors ${
            isDense
              ? "text-[13px] sm:text-sm md:text-sm"
              : "text-base sm:text-sm"
          }`}
        >
          {postData.title}
        </div>

        <div
          className={`mt-1 flex items-center justify-between text-text-secondary font-medium ${isDense ? "text-xs  " : "text-sm"}`}
        >
          <div>ID: #{postData.videoId}</div>
          <div className="flex items-center gap-1 transition group-hover:translate-x-0.5 text-text-secondary">
            <span>Watch</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
