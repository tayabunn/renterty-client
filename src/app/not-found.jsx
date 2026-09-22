"use client";

import React from "react";
import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full py-20 px-4 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-6 font-bold text-2xl">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
        Sorry, we couldn&apos;t find the rental page or resource you are looking for.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 transition-all duration-200"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/properties"
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-slate-200 rounded-xl font-semibold transition-all duration-200"
        >
          <Search className="h-4 w-4" />
          <span>Explore Properties</span>
        </Link>
      </div>
    </div>
  );
}
