"use client";

import React, { useSyncExternalStore, useCallback } from "react";
import { LayoutGrid, Columns2, Rows, Grid3X3 } from "lucide-react";
import Card from "./Card";

const STORAGE_KEY = "card_grid_density";

function subscribe(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "dense";
  } catch {
    return "dense";
  }
}

function getServerSnapshot() {
  return "dense";
}

const CardContiner = ({ data = [], showToggle = true, title = null }) => {
  const list = Array.isArray(data) ? data : [];
  // 'dense' = 2 cards per row on mobile, 5 on PC
  // 'comfortable' = 1 card per row on mobile, 4 on PC
  const density = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggleDensity = useCallback(() => {
    const next = density === "dense" ? "comfortable" : "dense";
    try {
      localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignore localStorage errors
    }
  }, [density]);

  const isDense = density === "dense";

  return (
    <div className="w-full flex flex-col">
      {/* Header with density switcher toggle */}
      {showToggle && list.length > 0 && (
        <div className="flex items-center justify-between mb-6 px-1">
          {title ? (
            <div className="text-2xl font-bold text-text-primary">{title}</div>
          ) : (
            <div />
          )}

          {/* Grid Layout Toggle Switch */}
          <button
            type="button"
            onClick={toggleDensity}
            aria-label={
              isDense
                ? "Switch to 1 per row (mobile) / 4 per row (PC)"
                : "Switch to 2 per row (mobile) / 5 per row (PC)"
            }
            className="flex items-center gap-2 px-3 py-1.5  bg-surface hover:bg-surface-hover border border-border/80 text-text-secondary hover:text-text-primary text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer shadow-xs ml-auto select-none"
          >
            {/* Mobile label: 2 / Row vs 1 / Row */}
            <span className="flex sm:hidden items-center gap-1.5 font-semibold">
              {isDense ? (
                <>
                  <Columns2 className="w-4 h-4 text-primary" />
                  <span>2 / Row</span>
                </>
              ) : (
                <>
                  <Rows className="w-4 h-4 text-primary" />
                  <span>1 / Row</span>
                </>
              )}
            </span>

            {/* Desktop label: 5 / Row vs 4 / Row */}
            <span className="hidden sm:flex items-center gap-1.5 font-semibold">
              {isDense ? (
                <>
                  <Grid3X3 className="w-4 h-4 text-primary" />
                  <span>5 / Row</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-4 h-4 text-primary" />
                  <span>4 / Row</span>
                </>
              )}
            </span>
          </button>
        </div>
      )}

      {/* Responsive Grid Container */}
      <div
        className={`grid justify-items-center transition-all duration-300 ${
          isDense
            ? "grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }`}
      >
        {list.map((item, index) => (
          <Card
            key={item?._id || item?.id || index}
            data={item}
            isDense={isDense}
          />
        ))}
      </div>
    </div>
  );
};

export default CardContiner;
