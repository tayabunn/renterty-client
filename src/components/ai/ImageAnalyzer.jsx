"use client";

import React, { useState } from "react";
import { Sparkles, Eye, Check, AlertCircle, Loader2, Tag } from "lucide-react";
import { aiAnalyzeImage } from "../../lib/ai";
import toast from "react-hot-toast";

export default function ImageAnalyzer({ imageUrl, onAddDetectedAmenities, propertyLocation = "" }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async () => {
    if (!imageUrl || !imageUrl.trim()) {
      toast.error("Please enter an image URL first");
      return;
    }

    setAnalyzing(true);
    try {
      const response = await aiAnalyzeImage(imageUrl.trim(), { location: propertyLocation });
      if (response.success && response.data) {
        setAnalysisResult(response.data);
        toast.success(`Image identified as ${response.data.roomType}!`);
      }
    } catch (err) {
      toast.error(err.message || "Failed to analyze image");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="mt-1.5">
      {!analysisResult ? (
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={analyzing || !imageUrl}
          className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center space-x-1 disabled:opacity-40 transition-colors cursor-pointer"
        >
          {analyzing ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Analyzing Photo...</span>
            </>
          ) : (
            <>
              <Eye className="h-3 w-3" />
              <span>✨ AI Vision Tag & Inspect</span>
            </>
          )}
        </button>
      ) : (
        <div className="p-2.5 bg-teal-50/70 dark:bg-teal-950/30 border border-teal-500/20 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-900 dark:text-teal-200">
              🏷️ Room: {analysisResult.roomType}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              Quality: {analysisResult.qualityScore}/10
            </span>
          </div>

          {analysisResult.caption && (
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 italic">
              "{analysisResult.caption}"
            </p>
          )}

          {/* Tags */}
          {analysisResult.tags && analysisResult.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {analysisResult.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-teal-500/20 text-slate-700 dark:text-zinc-300 flex items-center gap-1"
                >
                  <Tag className="h-2.5 w-2.5 text-teal-500" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
