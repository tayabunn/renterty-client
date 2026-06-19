"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an analytics service or console
    console.error("Runtime error caught at boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full py-16 px-4 bg-slate-50 dark:bg-zinc-950 text-center">
      <div className="p-4 bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full mb-6">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
        Something went wrong!
      </h1>
      <p className="mt-4 text-base text-slate-600 dark:text-zinc-400 max-w-md mx-auto">
        {error?.message || "An unexpected error occurred during execution. Please reload or return home."}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center space-x-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold shadow transition-all duration-200"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="flex items-center space-x-2 px-5 py-2.5 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-lg font-semibold transition-all duration-200"
        >
          <Home className="h-4 w-4" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}
