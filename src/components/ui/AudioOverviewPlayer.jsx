"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AudioOverviewPlayer({
  title,
  location,
  propertyType,
  rent,
  rentType,
  bedrooms,
  bathrooms,
  description
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef(null);

  const narrationScript = `Welcome to this verified ${propertyType || "rental property"}, ${title}, located in ${location}. 
Offering ${bedrooms || 2} bedrooms and ${bathrooms || 1} bathrooms, this home is available for ${rent ? `$${rent.toLocaleString()}` : "competitive rates"} per ${rentType === "Monthly" ? "month" : "day"}. 
Overview details: ${description || "Features high-end modern amenities, secure digital leases, and verified property management on Renterty."}`;

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (!supported) return;

    const synth = window.speechSynthesis;

    if (isPlaying && !isPaused) {
      synth.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      synth.resume();
      setIsPaused(false);
      return;
    }

    // Start fresh speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(narrationScript);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!supported) return null;

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/5 dark:from-teal-950/40 dark:via-zinc-900 dark:to-emerald-950/30 border border-teal-500/20 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-xl ${isPlaying ? "bg-teal-500 text-white animate-pulse" : "bg-teal-500/20 text-teal-600 dark:text-teal-300"}`}>
          <Volume2 className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              AI Audio Overview
            </h5>
            <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-500/30 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" /> Spoken Narration
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Listen to narrated property highlights and rental terms
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 self-end sm:self-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTogglePlay}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause className="h-3.5 w-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isPaused ? "Resume" : "Listen"}</span>
            </>
          )}
        </motion.button>

        {isPlaying && (
          <button
            type="button"
            onClick={handleStop}
            className="p-1.5 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-700 text-xs transition cursor-pointer"
            title="Stop narration"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
