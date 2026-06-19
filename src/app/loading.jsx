"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full py-16 px-4 bg-slate-50 dark:bg-zinc-950">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
        <div className="absolute w-8 h-8 border-4 border-emerald-500/20 border-b-emerald-500 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <h2 className="mt-6 text-lg font-semibold text-slate-700 dark:text-zinc-300">
        Loading Renterty...
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500 animate-pulse">
        Fetching listings and setting up your environment.
      </p>
    </div>
  );
}
