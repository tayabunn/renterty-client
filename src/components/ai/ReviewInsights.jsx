"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ThumbsUp, AlertCircle, MessageSquare, Loader2, CheckCircle2, TrendingUp } from "lucide-react";
import { aiAnalyzeReviews } from "../../lib/ai";

export default function ReviewInsights({ propertyId = null, ownerId = null, title = "AI Tenant Review & Sentiment Insights" }) {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await aiAnalyzeReviews({ propertyId, ownerId });
        if (response.success && response.data) {
          setInsights(response.data);
        }
      } catch (err) {
        console.warn("Could not load review insights:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [propertyId, ownerId]);

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl flex items-center justify-center space-x-2 text-xs text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
        <span>Analyzing tenant review sentiments...</span>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="p-5 sm:p-6 bg-linear-to-br from-white via-teal-500/5 to-white dark:from-zinc-900 dark:via-teal-950/20 dark:to-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-linear-to-tr from-teal-500 to-emerald-500 text-white rounded-xl shadow-xs">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Natural language intelligence extracted from {insights.totalReviews || 0} tenant reviews
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            <span>Overall: {insights.overallSentiment} ({insights.sentimentScore}%)</span>
          </span>
        </div>
      </div>

      {/* Topics Progress Grid */}
      {insights.topics && insights.topics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {insights.topics.map((t, idx) => (
            <div
              key={idx}
              className="p-3 bg-white dark:bg-zinc-800/80 rounded-xl border border-slate-200/70 dark:border-zinc-700/70 space-y-1.5"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 dark:text-zinc-200">{t.name}</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{t.score}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    t.score >= 80
                      ? "bg-teal-500"
                      : t.score >= 65
                      ? "bg-amber-400"
                      : "bg-rose-400"
                  }`}
                  style={{ width: `${t.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Praise and Improvements Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {insights.topPraise && insights.topPraise.length > 0 && (
          <div className="p-3 bg-teal-50/60 dark:bg-teal-950/20 border border-teal-500/20 rounded-xl space-y-1">
            <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" /> Key Tenant Praise:
            </span>
            <ul className="text-[11px] text-teal-800 dark:text-teal-300 space-y-1 pl-4 list-disc">
              {insights.topPraise.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {insights.areasToImprove && insights.areasToImprove.length > 0 && (
          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-1">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" /> Actionable Insights:
            </span>
            <ul className="text-[11px] text-amber-800 dark:text-amber-300 space-y-1 pl-4 list-disc">
              {insights.areasToImprove.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
