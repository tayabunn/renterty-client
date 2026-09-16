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
  ChevronUp,
  Info
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

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
    if (score >= 75) return 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800';
    return 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
  };

  const getProgressBarColor = (score) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  const nearbyPOIs = [
    { icon: Coffee, title: 'Cafes & Bakeries', distance: '3 min walk (220m)' },
    { icon: ShoppingBag, title: 'Supermarket & Groceries', distance: '5 min walk (400m)' },
    { icon: Trees, title: 'Public Park & Dog Run', distance: '8 min walk (650m)' },
    { icon: Dumbbell, title: 'Fitness Center / Gym', distance: '10 min walk (800m)' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Neighborhood & Walkability Index
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Commute convenience & lifestyle metrics for {location}
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? 'Show Less' : 'Full Breakdown'}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Grid of Scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* WalkScore */}
        <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-emerald-500" /> Walk Score
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getScoreColor(walkScore)}`}>
              {walkScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${getProgressBarColor(walkScore)}`} style={{ width: `${walkScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
            {walkScore >= 90 ? "Walker's Paradise" : "Very Walkable"}
          </p>
        </div>

        {/* TransitScore */}
        <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-blue-500" /> Transit Score
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getScoreColor(transitScore)}`}>
              {transitScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${getProgressBarColor(transitScore)}`} style={{ width: `${transitScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
            {transitScore >= 85 ? "Excellent Transit" : "Good Transit Lines"}
          </p>
        </div>

        {/* Safety Rating */}
        <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Safety Score
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getScoreColor(safetyScore)}`}>
              {safetyScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${getProgressBarColor(safetyScore)}`} style={{ width: `${safetyScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Verified Safe Area</p>
        </div>

        {/* School Score */}
        <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-purple-500" /> Schools
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getScoreColor(schoolScore)}`}>
              {schoolScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${getProgressBarColor(schoolScore)}`} style={{ width: `${schoolScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Top Rated District</p>
        </div>
      </div>

      {/* Expanded POI details */}
      {expanded && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nearby Conveniences
            </h4>
            {nearbyPOIs.map((poi, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <poi.icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{poi.title}</span>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{poi.distance}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Environment & Noise
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" /> Ambient Noise:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{noiseLevel}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Daily errands do not require a car. Most dining, transit connections, and pharmacy needs are within comfortable 5-10 minute walking perimeter.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
