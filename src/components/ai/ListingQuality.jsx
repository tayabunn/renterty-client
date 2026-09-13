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
      if (response.success && response.data) {
        setAuditResult(response.data);
      }
    } catch (err) {
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
        className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs font-bold hover:bg-indigo-100 flex items-center space-x-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>✨ AI Quality & Fraud Audit</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI Listing Risk & Quality Audit"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-500 text-white rounded-xl">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    AI Listing Risk & Quality Audit
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {property?.title || "Property Moderation Review"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1.5 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <span className="text-xs font-semibold text-slate-500">
                  Running automated fraud & quality inspection...
                </span>
              </div>
            ) : auditResult ? (
              <div className="mt-4 space-y-4">
                {/* Score Meters */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-zinc-800/70 rounded-xl border border-slate-200 dark:border-zinc-700 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Quality Score
                    </span>
                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {auditResult.qualityScore}
                      <span className="text-xs font-normal text-slate-400">/100</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-zinc-800/70 rounded-xl border border-slate-200 dark:border-zinc-700 text-center">
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
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Flags & Discrepancies:
                    </span>
                    <ul className="text-xs text-rose-700 dark:text-rose-400 space-y-1 pl-4 list-disc">
                      {auditResult.issues.map((iss, i) => (
                        <li key={i}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings list if any */}
                {auditResult.warnings && auditResult.warnings.length > 0 && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Considerations:
                    </span>
                    <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1 pl-4 list-disc">
                      {auditResult.warnings.map((warn, i) => (
                        <li key={i}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {auditResult.recommendations && auditResult.recommendations.length > 0 && (
                  <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Recommendations:
                    </span>
                    <ul className="text-xs text-indigo-700 dark:text-indigo-400 space-y-1 pl-4 list-disc">
                      {auditResult.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 dark:text-zinc-500 italic text-center">
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
