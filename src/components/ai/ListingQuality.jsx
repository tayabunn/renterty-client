"use client";

import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, Loader2, Sparkles, X } from "lucide-react";
import { aiAnalyzeListing } from "../../lib/ai";
import toast from "react-hot-toast";

export default function ListingQuality({ property, isOwnerView = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const handleAudit = async () => {
    setIsOpen(true);
    if (auditResult) return; // already analyzed

    setLoading(true);
    try {
      const response = await aiAnalyzeListing(property);
      if (response && response.data) {
        setAuditResult(response.data);
      } else {
        throw new Error(response?.error || "Failed to audit listing");
      }
    } catch (err) {
      console.error("[ListingQuality Error]:", err);
      toast.error(err.message || "Failed to audit listing");
    } finally {
      setLoading(false);
    }
  };

  // Keyboard accessibility: Dismiss modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={handleAudit}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Audit listing quality and fraud risk for ${property?.title || 'property'}`}
        className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 rounded-lg text-xs font-bold hover:bg-teal-100/80 dark:hover:bg-teal-900/40 hover:border-teal-300 dark:hover:border-teal-700 flex items-center space-x-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none shadow-2xs"
      >
        <Sparkles className="h-3.5 w-3.5 text-teal-500" />
        <span>AI Quality & Fraud Audit</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI Listing Risk & Quality Audit"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 text-left"
        >
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg max-w-lg w-full p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh] text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 text-left">
              <div className="flex items-center space-x-3 text-left">
                <div className="p-2.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="text-left space-y-0.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    AI Listing Risk & Quality Audit
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    {property?.title || "Property Moderation Review"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                <span className="text-xs font-semibold text-slate-500">
                  Running automated fraud & quality inspection...
                </span>
              </div>
            ) : auditResult ? (
              <div className="mt-5 space-y-4 text-left">
                {/* Score Meters */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/70 rounded-lg border border-slate-200 dark:border-zinc-700 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Quality Score
                    </span>
                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {auditResult.qualityScore}
                      <span className="text-xs font-normal text-slate-400">/100</span>
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/70 rounded-lg border border-slate-200 dark:border-zinc-700 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Risk Level
                    </span>
                    <span
                      className={`text-2xl font-extrabold ${
                        auditResult.riskLevel === "High"
                          ? "text-rose-600"
                          : auditResult.riskLevel === "Medium"
                          ? "text-amber-500"
                          : "text-teal-600"
                      }`}
                    >
                      {auditResult.riskLevel}
                      <span className="text-xs font-normal text-slate-400 block">
                        Risk Score: {auditResult.riskScore}/100
                      </span>
                    </span>
                  </div>
                </div>

                {/* Issues list if any */}
                {auditResult.issues && auditResult.issues.length > 0 && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-lg space-y-2 text-left">
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Flags & Discrepancies:</span>
                    </span>
                    <ul className="text-xs text-rose-700 dark:text-rose-400 space-y-1.5 pl-5 list-disc text-left">
                      {auditResult.issues.map((iss, i) => (
                        <li key={i} className="text-left leading-relaxed">{iss}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings list if any */}
                {auditResult.warnings && auditResult.warnings.length > 0 && (
                  <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg space-y-2 text-left">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Considerations:</span>
                    </span>
                    <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1.5 pl-5 list-disc text-left">
                      {auditResult.warnings.map((warn, i) => (
                        <li key={i} className="text-left leading-relaxed">{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {auditResult.recommendations && auditResult.recommendations.length > 0 && (
                  <div className="p-4 bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-900/60 rounded-lg space-y-2 text-left">
                    <span className="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
                      <span>Recommendations:</span>
                    </span>
                    <ul className="text-xs text-teal-700 dark:text-teal-300 space-y-1.5 pl-5 list-disc text-left">
                      {auditResult.recommendations.map((rec, i) => (
                        <li key={i} className="text-left leading-relaxed">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 dark:text-zinc-500 italic text-center pt-1">
                  * Note: AI risk detection is advisory. Administrators retain final decision authority.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
