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

  // 1. Keep input in sync if URL changes (e.g., user hits browser Back button)
  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  // 2. DEBOUNCE EFFECT: Watches user typing and updates URL after 500ms delay
  useEffect(() => {
    const trimmed = query.trim();

    const debounceTimeout = setTimeout(() => {
      // Only update URL if the user has typed 3+ chars or completely cleared it
      if (trimmed !== currentQuery) {
        if (trimmed.length >= 3) {
          router.push(`/search?query=${encodeURIComponent(trimmed)}`);
        } else if (trimmed.length === 0) {
          router.push("/search");
        }
      }
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimeout);
  }, [query, currentQuery, router]);

  // 3. FETCH EFFECT: Triggers immediately when the URL changes
  useEffect(() => {
    const trimmed = currentQuery.trim();

    // Enforce 3 character minimum for actual fetching
    if (!trimmed || trimmed.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (cachedResults[trimmed]) {
      setResults(cachedResults[trimmed]);
      return;
    }

    const fetchResults = async () => {
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
    };

    fetchResults();
    // Removed cachedResults from dependency array to prevent infinite re-fetching loops
  }, [currentQuery]);

  // 4. Handle manual Enter/Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery.length >= 3) {
      router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    } else if (trimmedQuery.length === 0) {
      router.push("/search");
    }
  };

  const isUnderThreeChars = query.trim().length > 0 && query.trim().length < 3;

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
              className="border border-neutral-800 md:text-xl text-lg text-white outline-none px-4 py-3 max-w-3xl w-full bg-transparent"
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
          ) : isUnderThreeChars ? (
            <p className="text-neutral-400 text-xl mt-8">
              Please enter at least 3 characters to search...
            </p>
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
