"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition, useEffect } from "react";

const PaginationButtons = ({ page, total_pages }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Automatically redirect to page 1 if the current page is invalid or out of bounds
  useEffect(() => {
    // Make sure total_pages is loaded before running the check
    if (total_pages > 0) {
      if (!page || isNaN(page) || page < 1 || page > total_pages) {
        // Use replace instead of push so we don't break the browser's back button
        router.replace(`?page=1`);
      }
    }
  }, [page, total_pages, router]);

  const gotoPage = (p) => {
    if (isPending) return;
    startTransition(() => {
      router.push(`?page=${p}`);
    });
  };

  return (
    <div className="flex space-x-6 md:px-8 md:py-3 rounded-md border-borderColor max-w-2xl mx-auto items-center justify-center">
      <button
        type="button"
        disabled={page <= 1 || isPending}
        onClick={() => gotoPage(page - 1)}
        className="flex disabled:opacity-50 disabled:cursor-not-allowed flex-1 items-center border border-neutral-900 hover:border-accent active:scale-[0.98] cursor-pointer justify-center rounded-md py-3 text-base font-semibold border-myColor bg-neutral-900"
      >
        <ChevronLeft /> Prev
      </button>

      <h1 className="text-xl font-semibold">
        {isPending ? "Loading..." : `${page || "1"} / ${total_pages || "1"}`}
      </h1>

      <button
        type="button"
        disabled={page >= total_pages || isPending}
        onClick={() => gotoPage(page + 1)}
        className="flex flex-1 disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center border-neutral-900 border hover:border-accent active:scale-[0.98] cursor-pointer rounded-md py-3 text-base font-semibold border-myColor bg-neutral-900"
      >
        Next <ChevronRight />
      </button>
    </div>
  );
};

export default PaginationButtons;
