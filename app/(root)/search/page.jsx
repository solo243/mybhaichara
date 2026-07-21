"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CardContiner from "@/components/CardContiner";

const SearchPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(currentQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cachedResults, setCachedResults] = useState({});

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    const trimmed = currentQuery.trim();

    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (cachedResults[trimmed]) {
      setResults(cachedResults[trimmed]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const url = new URL(`${window.location.origin}/api/home`);
        url.searchParams.set("query", trimmed);

        const response = await fetch(url.toString(), {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        const items = data?.data || [];

        setResults(items);
        setCachedResults((prev) => ({ ...prev, [trimmed]: items }));
      } catch (error) {
        console.error("Search failed", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [currentQuery, cachedResults]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <main className="w-full min-h-screen bg-black md:px-2">
      <div className="md:pt-10 pt-4 max-w-7xl mx-auto">
        <div className="md:space-y-6 space-y-4">
          <h1 className="md:text-3xl font-semibold text-2xl text-white">
            Find your next Video here
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full md:flex items-center max-md:space-y-4 space-x-8"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border border-neutral-800 md:text-xl text-lg text-white outline-none px-4 py-3 max-w-3xl w-full"
              placeholder="search video, id, tag here..."
            />
            <button
              type="submit"
              className="text-2xl cursor-pointer font-semibold py-2.5 text-black bg-white px-8 h-full"
            >
              Search
            </button>
          </form>
        </div>

        <div className="pt-14">
          {loading ? (
            <p className="text-white text-xl">Searching...</p>
          ) : currentQuery && results.length === 0 ? (
            <p className="text-white text-xl mt-8">
              No videos found for {currentQuery}
            </p>
          ) : (
            <CardContiner data={results} />
          )}
        </div>
      </div>
    </main>
  );
};

const SearchPage = () => (
  <Suspense
    fallback={
      <main className="min-h-screen bg-black px-4 py-10 text-white">
        Loading search...
      </main>
    }
  >
    <SearchPageContent />
  </Suspense>
);

export default SearchPage;
