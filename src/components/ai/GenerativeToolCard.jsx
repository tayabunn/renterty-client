"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Building,
  MapPin,
  BedDouble,
  Bath,
  ArrowRight,
  Calculator,
  CalendarCheck,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

export default function GenerativeToolCard({ toolState }) {
  if (!toolState) return null;

  const { status, name, input, result, error } = toolState;

  // 1. Tool Calling / Shimmering State
  if (status === "calling" || status === "executing") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-3 p-3.5 rounded-2xl bg-teal-500/10 dark:bg-teal-950/30 border border-teal-500/20 backdrop-blur-md space-y-2"
      >
        <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          <span>Executing PropTech Tool: {name || "Querying Database"}</span>
        </div>
        {input && Object.keys(input).length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {Object.entries(input).map(([k, v]) =>
              v ? (
                <span
                  key={k}
                  className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-zinc-800/80 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 border border-slate-200/50 dark:border-zinc-700/50"
                >
                  {k}: <span className="text-teal-600 dark:text-teal-400 font-bold">{String(v)}</span>
                </span>
              ) : null
            )}
          </div>
        )}
      </motion.div>
    );
  }

  // 2. Error State
  if (status === "error" || error) {
    return (
      <div className="my-3 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>Failed to execute {name}: {error || "Listing data unavailable"}. Try asking with broader criteria.</span>
      </div>
    );
  }

  // 3. Success / Output Available State (Generative UI Components)
  if (status === "success" && result) {
    // Component A: Property Search Results
    if (name === "searchProperties" && result.items && result.items.length > 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-3 space-y-2.5"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider px-1">
            <span className="flex items-center space-x-1">
              <Building className="h-3 w-3 text-teal-500" />
              <span>Verified Matching Rentals ({result.items.length})</span>
            </span>
            <span className="text-teal-600 dark:text-teal-400">{result.filterSummary}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.items.slice(0, 4).map((prop) => (
              <div
                key={prop._id || prop.title}
                className="group relative rounded-xl overflow-hidden bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/50 transition-all duration-200 flex flex-col justify-between shadow-2xs text-left"
              >
                <div className="relative h-28 w-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  {prop.images && prop.images[0] ? (
                    <Image
                      src={prop.images[0]}
                      alt={prop.title || "Rental Property"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 600px) 100vw, 300px"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                      <Building className="h-8 w-8" />
                    </div>
                  )}
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                    {prop.propertyType || "Apartment"}
                  </span>
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-xs text-white text-xs font-bold">
                    ${(prop.rent || 0).toLocaleString()}
                    <span className="text-[10px] font-normal">/{prop.rentType === "Monthly" ? "mo" : "day"}</span>
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-500 transition-colors">
                      {prop.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="h-3 w-3 text-teal-500 shrink-0" />
                      <span>{prop.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800 text-[10px] text-slate-600 dark:text-zinc-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3 w-3 text-teal-500" />
                      <span>{prop.bedrooms || 2} Bed</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3 text-teal-500" />
                      <span>{prop.bathrooms || 1} Bath</span>
                    </span>

                    <Link
                      href={`/properties/${prop._id}`}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-teal-500 dark:bg-zinc-800 dark:hover:bg-teal-500 text-white rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
                    >
                      <span>View</span>
                      <ChevronRight className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    // Component B: Rent Estimator Card
    if (name === "estimateRent") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-3 p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-teal-500/5 dark:from-teal-950/40 dark:via-zinc-900 dark:to-emerald-950/40 border border-teal-500/30 text-left space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-teal-500 text-white">
                <Calculator className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">AI Rent Valuation</h5>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{result.location} • {result.specs}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-500/30">
              {result.confidence}% Confidence
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 block">Calculated Fair Market Rate</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                ${result.estimatedRent.toLocaleString()}
                <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">/month</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 block">Expected Range</span>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                ${result.lowRange.toLocaleString()} – ${result.highRange.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-2">
            <Link
              href="/properties"
              className="flex-1 text-center py-1.5 px-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-[11px] font-bold transition shadow-xs"
            >
              Browse Comp Listings
            </Link>
            <Link
              href="/landlords"
              className="py-1.5 px-3 rounded-lg bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-[11px] font-semibold border border-slate-200 dark:border-zinc-700 transition"
            >
              List at this Rate
            </Link>
          </div>
        </motion.div>
      );
    }

    // Component C: Tour Booking Card
    if (name === "scheduleTour") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-3 p-3.5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-teal-500/30 text-left space-y-2.5 shadow-2xs"
        >
          <div className="flex items-center space-x-2">
            <CalendarCheck className="h-4 w-4 text-teal-500" />
            <h5 className="text-xs font-bold text-slate-900 dark:text-white">Tour Proposal Ready</h5>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 text-xs space-y-1">
            <p className="font-semibold text-slate-800 dark:text-zinc-200">{result.propertyTitle}</p>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
              Time: {result.preferredDate} ({result.tourType})
            </p>
          </div>
          <Link
            href={result.actionUrl || "/properties"}
            className="block text-center w-full py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-90 transition"
          >
            Confirm & Select Tour Time
          </Link>
        </motion.div>
      );
    }

    // Component D: Maintenance Triage Card
    if (name === "triageMaintenance") {
      const isCritical = result.urgency?.includes("Critical") || result.urgency?.includes("Urgent");
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`my-3 p-4 rounded-2xl text-left space-y-3 border shadow-xs ${
            isCritical
              ? "bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/25 text-rose-950 dark:text-rose-100"
              : "bg-teal-500/10 dark:bg-teal-950/30 border-teal-500/25 text-teal-950 dark:text-teal-100"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center space-x-1.5 text-xs font-bold tracking-tight">
              {isCritical ? (
                <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 animate-pulse" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-teal-500 shrink-0" />
              )}
              <span className={isCritical ? "text-rose-700 dark:text-rose-300 font-extrabold" : "text-teal-700 dark:text-teal-300 font-extrabold"}>
                AI Triage: {result.urgency}
              </span>
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/70 dark:bg-zinc-800/80 border border-slate-200/50 dark:border-zinc-700/50 text-slate-700 dark:text-zinc-300">
              Response ETA: {result.sla}
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900/90 p-3 rounded-xl border border-slate-200/60 dark:border-zinc-800/80 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Immediate Safety Recommendation
            </span>
            <p className="text-xs font-medium text-slate-800 dark:text-zinc-200 leading-relaxed">
              {result.safetyTip}
            </p>
          </div>

          <div className="pt-0.5 flex items-center justify-between">
            <Link
              href="/dashboard?tab=maintenance"
              className="inline-flex items-center space-x-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              <span>Track in Maintenance Hub</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      );
    }
  }

  return null;
}
