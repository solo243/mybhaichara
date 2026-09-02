import React from "react";

export default function MmsLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="max-w-7xl py-4 w-full mx-auto">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-xl bg-background"
            >
              <div className="h-48 bg-neutral-800 rounded-lg" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-neutral-800" />
                <div className="h-4 w-1/2 rounded bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
