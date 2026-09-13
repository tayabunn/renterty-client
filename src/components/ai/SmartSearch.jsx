"use client";

import React, { useState } from "react";
import { Sparkles, Search, Loader2, X, SlidersHorizontal, Check } from "lucide-react";
import { aiSmartSearch } from "../../lib/ai";
import toast from "react-hot-toast";

export default function SmartSearch({ onApplyFilters, onSearchResults }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const sampleQueries = [
    "2 bedroom flat in Uttara under 30k with AC",
    "Affordable studio in Gulshan with parking",
    "Luxury 3 bed villa with pool",
    "Pet-friendly cabin under 25000"
  ];

  const handleSearch = async (textToSearch) => {
    const searchText = textToSearch || query;
    if (!searchText.trim()) {
      toast.error("Please enter a natural language search query");
      return;
    }

    setLoading(true);
    try {
      const response = await aiSmartSearch(searchText);
      if (response.success) {
        setLastResult(response);
        toast.success("AI search interpreted!");
        if (onSearchResults) {
          onSearchResults(response.properties, response.criteria);
        }
        if (onApplyFilters && response.criteria) {
          onApplyFilters(response.criteria);
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to process search");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setLastResult(null);
  };

  return (
    <div
      role="search"
      aria-label="AI Smart Property Search"
      className="w-full bg-linear-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 dark:from-teal-950/40 dark:via-emerald-950/30 dark:to-teal-950/40 border border-teal-500/30 dark:border-teal-500/20 rounded-2xl p-4 sm:p-6 shadow-lg shadow-teal-500/5 mb-8 backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-linear-to-tr from-teal-500 to-emerald-500 text-white rounded-lg shadow-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              AI Smart Property Search
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300">
                NLP Powered
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Describe your ideal rental in everyday language
            </p>
          </div>
        </div>

        {lastResult && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Reset AI Search filters"
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 flex items-center space-x-1 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none rounded-md px-1 py-0.5 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset AI Search</span>
          </button>
        )}
      </div>

      {/* Input Search Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <label htmlFor="smart-search-input" className="sr-only">
            Natural language search query
          </label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
          <input
            id="smart-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 2 bedroom flat in Uttara under 30000 with air conditioning..."
            aria-label="Describe what kind of property you are looking for"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          aria-label="Execute AI smart search"
          className="px-6 py-3 bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-teal-500/20 disabled:opacity-50 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Smart Search</span>
            </>
          )}
        </button>
      </form>

      {/* Suggested Quick Prompts */}
      {!lastResult && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" /> Try:
          </span>
          {sampleQueries.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(sample);
                handleSearch(sample);
              }}
              aria-label={`Search query: ${sample}`}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/70 dark:bg-zinc-900/70 border border-slate-200/80 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
            >
              {sample}
            </button>
          ))}
        </div>
      )}

      {/* Interpreted Filters Live Notification Bar */}
      {lastResult && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 pt-3 border-t border-teal-500/20 flex flex-col gap-2"
        >
          <div className="text-xs font-medium text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-teal-500" />
            <span>{lastResult.summary}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {lastResult.criteria?.location && (
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-medium">
                📍 Location: {lastResult.criteria.location}
              </span>
            )}
            {lastResult.criteria?.propertyType && lastResult.criteria.propertyType !== "All" && (
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-medium">
                🏠 Type: {lastResult.criteria.propertyType}
              </span>
            )}
            {lastResult.criteria?.maxPrice && (
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-medium">
                💰 Max: ${lastResult.criteria.maxPrice.toLocaleString()}
              </span>
            )}
            {lastResult.criteria?.bedrooms && (
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-medium">
                🛏️ {lastResult.criteria.bedrooms} Beds
              </span>
            )}
            {Array.isArray(lastResult.criteria?.amenities) && lastResult.criteria.amenities.map((am, idx) => (
              <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
                ✓ {am}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
