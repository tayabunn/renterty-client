"use client";

import React, { useState } from "react";
import { Sparkles, DollarSign, TrendingUp, ShieldCheck, Check, Loader2, Info } from "lucide-react";
import { aiEstimateRent } from "../../lib/ai";
import toast from "react-hot-toast";

export default function RentEstimator({
  formData,
  onApplyRent
}) {
  const [loading, setLoading] = useState(false);
  const [estimateData, setEstimateData] = useState(null);

  const handleEstimate = async () => {
    if (!formData.location) {
      toast.error("Please enter a property location first");
      return;
    }

    setLoading(true);
    try {
      const response = await aiEstimateRent({
        location: formData.location,
        propertyType: formData.propertyType || "Apartment",
        bedrooms: formData.bedrooms || 1,
        bathrooms: formData.bathrooms || 1,
        size: formData.size || 0,
        amenities: formData.amenities || []
      });

      if (response.success && response.data) {
        setEstimateData(response.data);
        toast.success("Market rent estimate calculated!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to calculate estimate");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!estimateData?.estimatedRent) return;
    if (onApplyRent) {
      onApplyRent(estimateData.estimatedRent);
      toast.success(`Applied $${estimateData.estimatedRent.toLocaleString()} as listing rent!`);
    }
  };

  return (
    <div className="p-3.5 sm:p-4 bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-transparent border border-emerald-500/20 rounded-2xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-emerald-500 text-white rounded-lg">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              AI Market Rent Estimator
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 uppercase">
                Data-Driven
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Calculate fair market pricing based on comparable local listings
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleEstimate}
          disabled={loading || !formData.location}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Estimate Rent</span>
            </>
          )}
        </button>
      </div>

      {/* Output Display */}
      {estimateData && (
        <div className="mt-3 pt-3 border-t border-emerald-500/20 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Estimated Rent
              </span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                ${estimateData.estimatedRent.toLocaleString()}
                <span className="text-xs font-normal text-slate-500">/mo</span>
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Suggested Range
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                ${estimateData.suggestedRange.min.toLocaleString()} – ${estimateData.suggestedRange.max.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Confidence Level
              </span>
              <span className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                {estimateData.confidence}% ({estimateData.comparablesCount} comps)
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed bg-white/50 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-emerald-500/10">
            💡 {estimateData.marketSummary}
          </p>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Use ${estimateData.estimatedRent.toLocaleString()} for this Listing</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
