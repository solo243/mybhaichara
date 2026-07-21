"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

const PaginationButtons = ({ page, total_pages }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const gotoPage = (p) => {
    startTransition(() => {
      router.push(`?page=${p}`);
    });
  };

  return (
    <div className="flex   space-x-6 md:px-8 md:py-3 rounded-md border-borderColor  max-w-2xl mx-auto items-center justify-center">
      <button
        type="button"
        disabled={page <= 1 || isPending}
        onClick={() => gotoPage(page - 1)}
        className="flex disabled:opacity-50 disabled:cursor-not-allowed flex-1 items-center border border-neutral-900 hover:border-accent active:scale-[0.98] cursor-pointer justify-center rounded-md py-3 text-base font-semibold border-myColor bg-neutral-900"
      >
        <ChevronLeft /> Prev
      </button>

      <h1 className=" text-xl  font-semibold">
        {isPending ? "Loading..." : `${page || "NA"} / ${total_pages || "NA"}`}
      </h1>
      <button
        type="button"
        disabled={page >= total_pages || isPending}
        onClick={() => gotoPage(page + 1)}
        className="flex flex-1 disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center border-neutral-900 border hover:border-accent  active:scale-[0.98] cursor-pointer rounded-md py-3 text-base font-semibold border-myColor bg-neutral-900"
      >
        Next <ChevronRight />
      </button>
    </div>
  );
};

export default PaginationButtons;
