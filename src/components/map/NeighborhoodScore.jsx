'use client';

import React, { useState } from 'react';
import { 
  Footprints, 
  Bus, 
  GraduationCap, 
  Volume2, 
  Coffee, 
  ShoppingBag, 
  Trees, 
  Dumbbell, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function NeighborhoodScore({ location = 'Downtown Area', propertyType = 'Apartment' }) {
  const [expanded, setExpanded] = useState(false);

  // Compute deterministic scores based on location hash
  const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const walkScore = 75 + (hash % 23); // 75 - 97
  const transitScore = 70 + ((hash * 3) % 28); // 70 - 97
  const safetyScore = 80 + ((hash * 7) % 18); // 80 - 97
  const schoolScore = 65 + ((hash * 11) % 30); // 65 - 94
  const noiseLevel = (hash % 3 === 0) ? 'Quiet (Residential)' : (hash % 3 === 1) ? 'Moderate (Urban)' : 'Low Traffic';

  const getScoreBadgeStyle = (score) => {
    if (score >= 90) {
      return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/80';
    }
    return 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border-teal-200/80 dark:border-teal-800/80';
  };

  const getProgressBarColor = (score) => {
    if (score >= 90) {
      return 'bg-gradient-to-r from-teal-500 to-emerald-400';
    }
    return 'bg-gradient-to-r from-teal-500 to-emerald-500';
  };

  const nearbyPOIs = [
    { icon: Coffee, title: 'Cafes & Bakeries', distance: '3 min walk (220m)' },
    { icon: ShoppingBag, title: 'Supermarket & Groceries', distance: '5 min walk (400m)' },
    { icon: Trees, title: 'Public Park & Dog Run', distance: '8 min walk (650m)' },
    { icon: Dumbbell, title: 'Fitness Center / Gym', distance: '10 min walk (800m)' }
  ];

  return (
    <div className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden text-left flex flex-col justify-between transition-all duration-300">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/60">
            <Footprints className="w-5 h-5 text-teal-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Neighborhood &amp; Walkability Index
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Commute convenience &amp; lifestyle metrics for {location}
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 cursor-pointer transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? 'Show Less' : 'Full Breakdown'}
          {expanded ? <ChevronUp className="w-4 h-4 text-teal-500" /> : <ChevronDown className="w-4 h-4 text-teal-500" />}
        </button>
      </div>

      {/* Grid of Scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 mb-2 relative z-10">
        {/* WalkScore */}
        <div className="p-3.5 sm:p-4 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/40 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-teal-500" /> Walk Score
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getScoreBadgeStyle(walkScore)}`}>
              {walkScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden my-1">
            <div className={`h-full rounded-full ${getProgressBarColor(walkScore)}`} style={{ width: `${walkScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 font-medium">
            {walkScore >= 90 ? "Walker's Paradise" : "Very Walkable"}
          </p>
        </div>

        {/* TransitScore */}
        <div className="p-3.5 sm:p-4 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/40 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-teal-500" /> Transit Score
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getScoreBadgeStyle(transitScore)}`}>
              {transitScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden my-1">
            <div className={`h-full rounded-full ${getProgressBarColor(transitScore)}`} style={{ width: `${transitScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 font-medium">
            {transitScore >= 85 ? "Excellent Transit" : "Good Transit Lines"}
          </p>
        </div>

        {/* Safety Rating */}
        <div className="p-3.5 sm:p-4 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/40 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Safety Score
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getScoreBadgeStyle(safetyScore)}`}>
              {safetyScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden my-1">
            <div className={`h-full rounded-full ${getProgressBarColor(safetyScore)}`} style={{ width: `${safetyScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 font-medium">Verified Safe Area</p>
        </div>

        {/* School Score */}
        <div className="p-3.5 sm:p-4 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/40 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-teal-500" /> Schools
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getScoreBadgeStyle(schoolScore)}`}>
              {schoolScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden my-1">
            <div className={`h-full rounded-full ${getProgressBarColor(schoolScore)}`} style={{ width: `${schoolScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 font-medium">Top Rated District</p>
        </div>
      </div>

      {/* Expanded POI details */}
      {expanded && (
        <div className="pt-4 mt-3 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300 relative z-10">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Nearby Conveniences
            </h4>
            {nearbyPOIs.map((poi, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-slate-50/80 dark:bg-zinc-950/50 border border-slate-200/60 dark:border-zinc-800/60">
                <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                  <poi.icon className="w-3.5 h-3.5 text-teal-500" />
                  <span>{poi.title}</span>
                </div>
                <span className="font-semibold text-teal-600 dark:text-teal-400">{poi.distance}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Environment &amp; Noise
            </h4>
            <div className="p-3.5 rounded-lg bg-slate-50/80 dark:bg-zinc-950/50 border border-slate-200/60 dark:border-zinc-800/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-zinc-400 flex items-center gap-1.5 font-semibold">
                  <Volume2 className="w-3.5 h-3.5 text-teal-500" /> Ambient Noise:
                </span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">{noiseLevel}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                Daily errands do not require a car. Most dining, transit connections, and pharmacy needs are within comfortable 5-10 minute walking perimeter.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
