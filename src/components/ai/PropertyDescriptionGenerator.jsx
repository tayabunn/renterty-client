"use client";

import React, { useState } from "react";
import { Sparkles, Wand2, Check, Copy, RefreshCw, Loader2, X, FileText } from "lucide-react";
import { aiGenerateDescription } from "../../lib/ai";
import toast from "react-hot-toast";

export default function PropertyDescriptionGenerator({
  formData,
  onApplyDescription,
  onApplyTitle
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [style, setStyle] = useState("Modern");
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  const styleOptions = [
    { id: "Modern", label: "✨ Modern & Clean" },
    { id: "Luxury", label: "💎 Luxury & Exclusive" },
    { id: "Professional", label: "🏢 Professional" },
    { id: "Cozy", label: "🏡 Warm & Cozy" },
    { id: "Minimal", label: "⚡ Minimalist" }
  ];

  const handleGenerate = async (mode = "generate") => {
    setLoading(true);
    try {
      const response = await aiGenerateDescription({
        title: formData.title,
        location: formData.location,
        propertyType: formData.propertyType,
        rent: formData.rent,
        rentType: formData.rentType,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        size: formData.size,
        amenities: formData.amenities,
        extraFeatures: formData.extraFeatures,
        existingDescription: formData.description,
        style,
        mode
      });

      if (response.success && response.data) {
        setGeneratedResult(response.data);
        toast.success("AI description crafted successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate description");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAll = () => {
    if (!generatedResult) return;
    if (onApplyTitle && generatedResult.title) {
      onApplyTitle(generatedResult.title);
    }
    if (onApplyDescription && generatedResult.detailedDescription) {
      onApplyDescription(generatedResult.detailedDescription);
    }
    toast.success("Applied AI title & description to listing form!");
    setIsOpen(false);
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
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Open AI Description Generator Wizard"
        className="px-3.5 py-1.5 bg-linear-to-r from-teal-500/15 to-emerald-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/25 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
      >
        <Sparkles className="h-3.5 w-3.5 text-teal-500" />
        <span>✨ AI Description Generator</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI Listing Copywriting Wizard"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-linear-to-tr from-teal-500 to-emerald-500 text-white rounded-xl">
                  <Wand2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    AI Listing Copywriting Wizard
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Craft SEO-optimized descriptions and titles tailored to your property specs
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

            {/* Tone Selector */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-2">
                Select Tone & Style:
              </label>
              <div className="flex flex-wrap gap-2">
                {styleOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStyle(opt.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      style === opt.id
                        ? "bg-teal-500 text-white border-teal-500 shadow-xs"
                        : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-teal-500/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleGenerate("generate")}
                className="flex-1 py-2.5 px-4 bg-linear-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Crafting Copy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Fresh Copy</span>
                  </>
                )}
              </button>

              {formData.description && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleGenerate("improve")}
                  className="py-2.5 px-4 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 hover:bg-slate-200 dark:hover:bg-zinc-700 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Improve Current Draft</span>
                </button>
              )}
            </div>

            {/* Output Preview */}
            {generatedResult && (
              <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Generated Headline:
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white p-2.5 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200/80 dark:border-zinc-700">
                    {generatedResult.title}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Detailed Description:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200/80 dark:border-zinc-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {generatedResult.detailedDescription}
                  </p>
                </div>

                {generatedResult.highlights && generatedResult.highlights.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Key Highlights:
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-zinc-400 space-y-1">
                      {generatedResult.highlights.map((hl, i) => (
                        <li key={i} className="flex items-center space-x-1.5">
                          <Check className="h-3.5 w-3.5 text-teal-500" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyAll}
                    className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Apply to Listing</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
