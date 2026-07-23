import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Card = ({ data }) => {
  const postData = {
    title: data?.title || "Title is not available aginat",
    img_url: data?.img_url || "",
    videos: data?.extracted_media?.direct_videos || [],
    id: data?.id || "NA",
    duration: data?.duration || "NA",
    videoId: data?.videoId || "NA",
  };

  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

  const slug = slugify(postData.title);

  return (
    <Link
      href={{
        pathname: `/post/${data._id}`,
      }}
      prefetch={true}
      className="group md:mb-6 mb-4 cursor-pointer block w-full overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
    >
      {/* Added w-full to ensure the relative container has width */}
      <div className="relative w-full h-48 overflow-hidden sm:h-52">
        {postData.img_url ? (
          <Image
            src={postData.img_url}
            // src="https://viralkand.com/wp-content/uploads/desi-girlfriend-mms-1.jpg"
            alt={postData.title}
            fill
            unoptimized // Bypasses the Vercel quota limit
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-fuchsia-600 via-violet-600 to-slate-900 text-sm font-semibold text-white">
            No preview available
          </div>
        )}

        <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
          {postData.duration || "NA"}
        </div>
      </div>

      <div className="mt-1 py-2">
        <h3 className="line-clamp-2 min-h-[2.6rem] font-semibold leading-snug text-white sm:text-[16px]">
          {postData.title}
        </h3>

        <div className="mt-1 flex items-center justify-between text-sm text-neutral-500 font-medium">
          <span>Post ID: #{postData.videoId}</span>
          <span className="font-medium flex items-center gap-0.5 text-sm transition group-hover:translate-x-1 ">
            view post <ArrowRight size={17} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Card;
