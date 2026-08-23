"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, X, TrendingUp } from "lucide-react";
import CardContiner from "@/components/CardContiner";

const SUGGESTED_SEARCHES = [
  "Girlfriend",
  "Hot",
  "Biwi",
  "69526",
  "39277",
  "54162",
  "Chudai",
];

const SearchPageContent = ({ currentQuery }) => {
  const router = useRouter();
  const [query, setQuery] = useState(currentQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const cachedResults = useRef({});

  // Debounced URL sync on input change
  useEffect(() => {
    const trimmed = query.trim();

    const debounceTimeout = setTimeout(() => {
      if (trimmed !== currentQuery) {
        if (trimmed.length >= 3) {
          router.push(`/search?query=${encodeURIComponent(trimmed)}`);
        } else if (trimmed.length === 0) {
          router.push("/search");
        }
      }
    }, 400);

    return () => clearTimeout(debounceTimeout);
  }, [query, currentQuery, router]);

  // Fetch search results when currentQuery changes
  useEffect(() => {
    const trimmed = currentQuery.trim();

    if (!trimmed || trimmed.length < 3) {
      return;
    }

    let ignore = false;

    const fetchResults = async () => {
      if (cachedResults.current[trimmed]) {
        if (!ignore) {
          setResults(cachedResults.current[trimmed]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `/api/home?query=${encodeURIComponent(trimmed)}`,
          { cache: "no-store" },
        );

        if (!response.ok) throw new Error("Search request failed");

        const data = await response.json();
        const items = data?.data || [];

        if (!ignore) {
          setResults(items);
          cachedResults.current[trimmed] = items;
        }
      } catch (error) {
        console.error("Search failed:", error);
        if (!ignore) setResults([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      ignore = true;
    };
  }, [currentQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery.length >= 3) {
      router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    } else if (trimmedQuery.length === 0) {
      router.push("/search");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    router.push(`/search?query=${encodeURIComponent(suggestion)}`);
  };

  const clearSearch = () => {
    setQuery("");
    router.push("/search");
  };

  const isUnderThreeChars = query.trim().length > 0 && query.trim().length < 3;

  return (
    <div className="w-full min-h-screen bg-background md:px-4 px-2 pb-20">
      <div className="md:pt-16 pt-8 max-w-7xl mx-auto flex flex-col items-center">
        {/* Header & Search Bar Container */}
        <div className="w-full max-w-4xl text-center space-y-6">
          <h1 className="md:text-4xl text-3xl font-bold text-text-primary tracking-tight">
            Find your next video
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-4"
          >
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5 transition-colors group-focus-within:text-primary" />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-surface border border-border text-text-primary outline-none px-4 py-4 pl-12 pr-12  transition-all md:text-lg shadow-sm placeholder:text-text-secondary focus:border-text-secondary"
                placeholder="Search by title, category, or tags..."
              />

              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors p-1 rounded-full hover:bg-surface-hover cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="md:w-auto w-full flex items-center justify-center gap-2 text-lg cursor-pointer font-semibold py-4 text-background bg-text-primary px-10  transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="flex items-center gap-1.5 text-sm text-text-secondary font-medium mr-2">
              <TrendingUp className="w-4 h-4" /> Suggestions:
            </span>
            {SUGGESTED_SEARCHES.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-1.5 text-sm font-medium text-text-primary bg-surface border border-border rounded-full hover:bg-surface-hover hover:border-text-secondary transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="w-full pt-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-surface border-b-primary animate-spin mb-4" />
              <p className="text-text-secondary font-medium text-lg">
                Searching...
              </p>
            </div>
          ) : isUnderThreeChars ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <div className="p-4 bg-surface rounded-full text-text-secondary">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-text-secondary text-lg">
                Please enter at least{" "}
                <span className="font-semibold text-text-primary">
                  3 characters
                </span>{" "}
                to search.
              </p>
            </div>
          ) : currentQuery && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <div className="p-4 bg-surface rounded-full text-text-secondary mb-2">
                <SearchX className="w-8 h-8" />
              </div>
              <h2 className="text-text-primary text-xl font-semibold">
                No videos found
              </h2>
              <p className="text-text-secondary text-lg max-w-md">
                We couldn&apos;t find anything matching &ldquo;
                <span className="text-text-primary font-medium">
                  {currentQuery}
                </span>
                &rdquo;. Try searching with different keywords.
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardContiner data={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchPageContentWrapper = () => {
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("query") || "";

  return <SearchPageContent key={currentQuery} currentQuery={currentQuery} />;
};

const SearchPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-text-secondary">
        <div className="w-10 h-10 rounded-full border-4 border-surface border-b-primary animate-spin mb-4" />
        <p>Loading search module...</p>
      </div>
    }
  >
    <SearchPageContentWrapper />
  </Suspense>
);

export default SearchPage;
