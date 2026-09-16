"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, MapPin, BedDouble, Bath, ArrowRight, Loader2, Info } from "lucide-react";
import { aiGetRecommendations } from "../../lib/ai";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await aiGetRecommendations(4);
        if (res.success) {
          setRecommendations(res.recommendations || []);
          setUserProfile(res.userProfile || null);
        }
      } catch (err) {
        console.warn("Could not load AI recommendations:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading) {
    return (
      <div className="py-8 text-center flex items-center justify-center space-x-2 text-slate-500 dark:text-zinc-400 text-xs">
        <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
        <span>Generating personalized property recommendations...</span>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="w-full my-6 md:my-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-linear-to-tr from-teal-500 to-emerald-500 text-white rounded-xl shadow-md shadow-teal-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              AI Recommendations For You
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                {userProfile?.hasHistory ? "Personalized" : "Curated Picks"}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              {userProfile?.hasHistory
                ? `Scored against your saved favorites & search preferences in ${userProfile.topLocation}`
                : "Multi-factor matched against verified platform performance & popularity"}
            </p>
          </div>
        </div>

        <Link
          href="/properties"
          className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1"
        >
          <span>Explore All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid of Recommended Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((rec, index) => {
          const prop = rec.property;
          if (!prop) return null;

          return (
            <motion.div
              key={prop._id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-teal-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Image Banner & Match Score Badge */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <img
                    src={prop.images && prop.images[0] ? prop.images[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"}
                    alt={prop.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-linear-to-r from-teal-600 to-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>{rec.matchScore}% Match</span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    ${prop.rent?.toLocaleString()}/{prop.rentType || "mo"}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 transition-colors">
                    {prop.title}
                  </h4>

                  <div className="flex items-center text-xs text-slate-500 dark:text-zinc-400 space-x-1">
                    <MapPin className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-zinc-300 pt-1">
                    <span className="flex items-center space-x-1">
                      <BedDouble className="h-3.5 w-3.5 text-slate-400" />
                      <span>{prop.bedrooms || 1} Bed</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Bath className="h-3.5 w-3.5 text-slate-400" />
                      <span>{prop.bathrooms || 1} Bath</span>
                    </span>
                  </div>

                  {/* AI Explanation Pill */}
                  <div className="mt-3 p-2.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-500/20 text-[11px] text-teal-800 dark:text-teal-300 leading-snug flex items-start space-x-1.5">
                    <Info className="h-3.5 w-3.5 text-teal-500 shrink-0 mt-0.5" />
                    <p className="line-clamp-2">{rec.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <Link
                  href={`/properties/${prop._id}`}
                  className="w-full py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-600 text-slate-700 dark:text-zinc-300 font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
