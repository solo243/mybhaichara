"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useTransition, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";

const PaginationButtons = ({ page = 1, total_pages = 15 }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Redirect to page 1 if URL is invalid
  useEffect(() => {
    if (total_pages > 0) {
      if (!page || isNaN(page) || page < 1 || page > total_pages) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
  }, [page, total_pages, router, pathname, searchParams]);

  // Safely updates the URL while keeping other search params (like ?query=xyz)
  const createQueryString = useCallback(
    (pageNumber) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", pageNumber.toString());
      return `${pathname}?${params.toString()}`;
    },
    [searchParams, pathname],
  );

  // Helper function to handle navigation
  const navigateToPage = (selectedPage) => {
    if (
      isPending ||
      selectedPage === page ||
      selectedPage < 1 ||
      selectedPage > total_pages
    )
      return;
    startTransition(() => {
      router.push(createQueryString(selectedPage));
    });
  };

  // react-paginate uses 0-based indexing
  const handlePageClick = (event) => {
    navigateToPage(event.selected + 1);
  };

  if (total_pages <= 1) return null;

  return (
    <div
      className={`w-full  flex flex-col items-center gap-6 transition-opacity duration-200 ${
        isPending ? "opacity-60 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* --- NUMBER PAGINATION (Shows on both Mobile and PC) --- */}
      <ReactPaginate
        breakLabel="..."
        previousLabel={
          <div className="flex items-center gap-1">
            <ChevronLeft className="w-5 h-5" />
            Prev
          </div>
        }
        nextLabel={
          <div className="flex items-center gap-1">
            Next
            <ChevronRight className="w-5 h-5" />
          </div>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={total_pages}
        forcePage={page - 1}
        renderOnZeroPageCount={null}
        // Container displays on both mobile and PC
        containerClassName="flex items-center flex-wrap justify-center gap-1.5 sm:gap-3 select-none px-2"
        // Numbered Pages - Scaled down slightly for mobile (w-9 h-9) so they fit nicely
        pageLinkClassName="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11    bg-surface text-text-primary hover:bg-surface-hover hover:border-text-secondary transition-all cursor-pointer font-medium text-base sm:text-base"
        activeLinkClassName="!bg-primary !text-white !border-primary shadow-md shadow-primary/20 scale-105"
        // --- CSS TRICK: Hide React-Paginate's Prev/Next buttons on mobile screens ---
        previousClassName="hidden sm:block"
        nextClassName="hidden sm:block"
        previousLinkClassName="flex items-center justify-center px-6 h-11  border border-border bg-surface text-text-primary hover:bg-surface-hover hover:border-text-secondary transition-all cursor-pointer font-medium"
        nextLinkClassName="flex items-center justify-center px-6 h-11  bg-surface border border-border text-text-primary hover:bg-surface-hover hover:border-text-secondary transition-all cursor-pointer font-medium"
        disabledLinkClassName="opacity-40 cursor-not-allowed hover:bg-surface hover:border-border"
        breakLinkClassName="flex items-center justify-center w-6 h-9 sm:w-11 sm:h-11 text-text-secondary cursor-default"
      />

      {/* --- MOBILE FULL-WIDTH PREV/NEXT BUTTONS (Hidden on PC) --- */}
      <div className="flex sm:hidden w-full px-2 gap-3 select-none">
        <button
          type="button"
          onClick={() => navigateToPage(page - 1)}
          disabled={page <= 1}
          className="flex-1 flex items-center justify-center gap-1 h-12  border border-border bg-surface text-text-primary hover:bg-surface-hover transition-all font-medium disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
          Prev
        </button>

        <button
          type="button"
          onClick={() => navigateToPage(page + 1)}
          disabled={page >= total_pages}
          className="flex-1 flex items-center justify-center gap-1 h-12    border border-border bg-surface text-text-primary hover:bg-surface-hover transition-all font-medium disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PaginationButtons;
