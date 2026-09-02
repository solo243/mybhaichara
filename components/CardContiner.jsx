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
    return localStorage.getItem(STORAGE_KEY) || "default";
  } catch {
    return "default";
  }
}

function getServerSnapshot() {
  return "default";
}

const CardContiner = ({ data = [], showToggle = true, title = null }) => {
  const list = Array.isArray(data) ? data : [];
  // 'default' = 2 cards per row on mobile, 4 on PC (default requested)
  // 'alternate' = 1 card per row on mobile, 5 on PC
  const density = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggleDensity = useCallback(() => {
    const next = density === "default" ? "alternate" : "default";
    try {
      localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignore localStorage errors
    }
  }, [density]);

  const isDefault = density === "default";

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
              isDefault
                ? "Switch to 1 per row (mobile) / 5 per row (PC)"
                : "Switch to 2 per row (mobile) / 4 per row (PC)"
            }
            className="flex items-center gap-2 px-3 py-1.5 bg-surface hover:bg-surface-hover border border-border/80 text-text-secondary hover:text-text-primary text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer shadow-xs ml-auto select-none"
          >
            {/* Mobile label: Switch to 1 / Row or 2 / Row */}
            <span className="flex sm:hidden items-center gap-1.5 font-semibold">
              {isDefault ? (
                <>
                  <Rows className="w-4 h-4 text-primary" />
                  <span>1 / Row</span>
                </>
              ) : (
                <>
                  <Columns2 className="w-4 h-4 text-primary" />
                  <span>2 / Row</span>
                </>
              )}
            </span>

            {/* Desktop label: Switch to 5 / Row or 4 / Row */}
            <span className="hidden sm:flex items-center gap-1.5 font-semibold">
              {isDefault ? (
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

      {/* Responsive Grid Container: 2 on mobile & 4 on PC by default */}
      <div
        className={`grid justify-items-center transition-all duration-300 ${
          isDefault
            ? "grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
            : "grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        }`}
      >
        {list.map((item, index) => (
          <Card
            key={item?._id || item?.id || index}
            data={item}
            isDense={isDefault}
          />
        ))}
      </div>
    </div>
  );
};

export default CardContiner;
