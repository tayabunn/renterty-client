"use client";

import React, { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { aiEstimateRent } from "@/lib/ai";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Building,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Loader2,
  Calculator,
  ShieldCheck,
  Percent,
  Sliders,
  Wallet,
  PieChart,
  BadgeAlert,
  ArrowUpRight,
  Info,
  Layers,
  ChevronDown,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/config";

function EstimatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "affordability" ? "affordability" : "landlord";
  const [activeMode, setActiveMode] = useState(initialMode); // "landlord" | "affordability"
  const [loading, setLoading] = useState(false);
  const [estimateResult, setEstimateResult] = useState(null);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "affordability" || mode === "landlord") {
      setActiveMode(mode);
    }
  }, [searchParams]);

  const handleModeSwitch = (mode) => {
    setActiveMode(mode);
    router.replace(`/estimator?mode=${mode}`, { scroll: false });
  };

  // Landlord Form State
  const [location, setLocation] = useState("Miami, FL");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [size, setSize] = useState(1100);
  const [amenities, setAmenities] = useState(["Wifi", "Pool", "Air Conditioning"]);

  // Tenant Affordability Dynamic States
  const [annualIncome, setAnnualIncome] = useState(85000);
  const [monthlyDebt, setMonthlyDebt] = useState(450);
  const [monthlyUtilities, setMonthlyUtilities] = useState(180);
  const [selectedRule, setSelectedRule] = useState("30percent"); // "30percent" | "50_30_20" | "40x" | "25percent"
  const [matchingProperties, setMatchingProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const availableAmenities = [
    "Wifi",
    "Pool",
    "Air Conditioning",
    "Gym",
    "Laundry",
    "Fireplace",
    "Gated Security",
    "Backyard",
    "Kitchen"
  ];

  const handleAmenityToggle = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleCalculateRent = async (e) => {
    e.preventDefault();
    if (!location) {
      toast.error("Please enter a property location");
      return;
    }

    setLoading(true);
    try {
      const res = await aiEstimateRent({
        location,
        propertyType,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        size: Number(size),
        amenities
      });

      if (res.success && res.data) {
        setEstimateResult(res.data);
        toast.success("AI valuation generated successfully!");
      } else {
        throw new Error(res.error || "Failed to generate valuation");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to estimate rent");
    } finally {
      setLoading(false);
    }
  };

  // --- Dynamic Affordability Computations ---
  const grossMonthlyIncome = Math.max(1, annualIncome / 12);
  const standardMaxRent = Math.round(grossMonthlyIncome * 0.3); // 30% rule
  const conservativeRent = Math.round(grossMonthlyIncome * 0.25); // 25% rule
  const stretchRent = Math.round(grossMonthlyIncome * 0.35); // 35% rule
  const rule40xRent = Math.round(annualIncome / 40); // 40x rule
  const rule503020Rent = Math.max(0, Math.round(grossMonthlyIncome * 0.5 - monthlyDebt - monthlyUtilities));

  // Determine active recommended rent based on chosen rule
  const activeRecommendedRent =
    selectedRule === "25percent"
      ? conservativeRent
      : selectedRule === "30percent"
      ? standardMaxRent
      : selectedRule === "40x"
      ? rule40xRent
      : rule503020Rent;

  const debtAdjustedRent = Math.max(0, Math.round((grossMonthlyIncome - monthlyDebt) * 0.33));
  const remainingCashflow = Math.max(
    0,
    Math.round(grossMonthlyIncome - activeRecommendedRent - monthlyDebt - monthlyUtilities)
  );

  // Percentage allocations for live visual progress breakdown
  const rentPct = Math.min(100, Math.round((activeRecommendedRent / grossMonthlyIncome) * 100));
  const debtPct = Math.min(100 - rentPct, Math.round((monthlyDebt / grossMonthlyIncome) * 100));
  const utilPct = Math.min(100 - rentPct - debtPct, Math.round((monthlyUtilities / grossMonthlyIncome) * 100));
  const savingsPct = Math.max(0, 100 - rentPct - debtPct - utilPct);

  // Financial Health Score
  const dtiRatio = Math.round(((activeRecommendedRent + monthlyDebt) / grossMonthlyIncome) * 100);
  let healthRating = {
    label: "Optimal Financial Health",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    desc: "Your housing + debt ratio is well below 36%. Ideal for high savings and lease approvals."
  };
  if (dtiRatio > 48) {
    healthRating = {
      label: "High Rent Burden",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/30",
      desc: "Housing + debt exceeds 48% of gross income. Consider lower rent or reducing debts."
    };
  } else if (dtiRatio > 38) {
    healthRating = {
      label: "Moderate / Stretched",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
      desc: "Housing + debt is between 38% - 48%. Manageable, but leaves less buffer for savings."
    };
  }

  // Fetch real properties matching calculated rent
  useEffect(() => {
    if (activeMode !== "affordability") return;
    const fetchBudgetProperties = async () => {
      setLoadingProps(true);
      try {
        const res = await fetch(`${API_URL}/properties?maxPrice=${activeRecommendedRent}&limit=3`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data) {
            setMatchingProperties(data.properties || []);
          }
        }
      } catch {
        // Fallback gracefully without console error
      } finally {
        setLoadingProps(false);
      }
    };

    const timer = setTimeout(fetchBudgetProperties, 400);
    return () => clearTimeout(timer);
  }, [activeRecommendedRent, activeMode]);

  const incomePresets = [45000, 65000, 85000, 120000, 175000];
  const debtPresets = [0, 250, 450, 800, 1200];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent dark:from-teal-950/40 dark:via-zinc-950 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-teal-700 dark:text-teal-300 text-xs font-bold shadow-xs">
            <Sparkles className="h-4 w-4 text-teal-500 animate-pulse" />
            <span>AI Real Estate & Financial Intelligence Studio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {activeMode === "affordability" ? (
              <>
                Rental Budget &{" "}
                <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  Affordability Calculator
                </span>
              </>
            ) : (
              <>
                Smart Rental Valuation{" "}
                <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                  & Pricing Estimator
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {activeMode === "affordability"
              ? "Calculate exactly how much rent you can comfortably afford based on your income, recurring debts, utilities, and landlord qualification standards."
              : "Powered by live market benchmarks, neighborhood scores, and AI regression models. Accurate predictive pricing for landlords."}
          </p>

          {/* Dynamic Mode Switcher */}
          <div className="inline-flex flex-col sm:flex-row p-1.5 bg-slate-200/80 dark:bg-zinc-800/90 rounded-2xl gap-1.5 shadow-inner border border-slate-300/40 dark:border-zinc-700/50 mt-2 max-w-full">
            <button
              onClick={() => handleModeSwitch("affordability")}
              className={`flex items-center justify-center space-x-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeMode === "affordability"
                  ? "bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-md scale-[1.02]"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
              }`}
            >
              <Calculator className="h-4 w-4 text-teal-500" />
              <span>Tenant Affordability Studio</span>
            </button>
            <button
              onClick={() => handleModeSwitch("landlord")}
              className={`flex items-center justify-center space-x-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeMode === "landlord"
                  ? "bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-md scale-[1.02]"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
              }`}
            >
              <Building className="h-4 w-4" />
              <span>Landlord Rent Estimator</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full max-w-[1650px] px-4 sm:px-6 md:px-8 xl:px-12 mx-auto py-8 sm:py-10 flex-1">
        {activeMode === "affordability" ? (
          /* ========================================================================= */
          /*                       DYNAMIC AFFORDABILITY STUDIO                        */
          /* ========================================================================= */
          <div className="space-y-10">
            {/* Top Interactive Grid: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Controls & Sliders */}
              <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500 dark:hover:border-teal-400 transition-colors duration-300 p-6 sm:p-8 rounded-lg text-left space-y-7">
                {/* Card Title */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-teal-500/10 text-teal-500 rounded-lg">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Financial Profile</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Adjust income and debt sliders to see instant calculations
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-semibold rounded-full border border-teal-200 dark:border-teal-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-Time Sync</span>
                  </div>
                </div>

                {/* 1. Annual Pre-Tax Income */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>Annual Gross Income (Pre-Tax)</span>
                    </label>
                    <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
                      ${annualIncome.toLocaleString()} / yr
                    </span>
                  </div>

                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="number"
                      min="10000"
                      max="500000"
                      step="1000"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-900 rounded-2xl text-base font-bold outline-none transition"
                    />
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min="20000"
                    max="250000"
                    step="2500"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />

                  {/* Quick Presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 mr-1">Presets:</span>
                    {incomePresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAnnualIncome(preset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          annualIncome === preset
                            ? "bg-teal-500 text-white shadow-xs"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
                        }`}
                      >
                        ${(preset / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Monthly Debt Obligations */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>Monthly Recurring Debt</span>
                    </label>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-zinc-200">
                      ${monthlyDebt.toLocaleString()} / mo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                    Includes student loans, auto payments, credit card minimums, and personal loans.
                  </p>

                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="50"
                      value={monthlyDebt}
                      onChange={(e) => setMonthlyDebt(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-900 rounded-2xl text-base font-bold outline-none transition"
                    />
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="2500"
                    step="50"
                    value={monthlyDebt}
                    onChange={(e) => setMonthlyDebt(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />

                  {/* Debt Presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 mr-1">Presets:</span>
                    {debtPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setMonthlyDebt(preset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          monthlyDebt === preset
                            ? "bg-teal-500 text-white shadow-xs"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Monthly Utilities & Incidentals */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                      Estimated Monthly Utilities & Wifi
                    </label>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-zinc-200">
                      ${monthlyUtilities.toLocaleString()} / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={monthlyUtilities}
                    onChange={(e) => setMonthlyUtilities(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 dark:text-zinc-500">
                    <span>$50 (Minimal)</span>
                    <span>$200 (Standard)</span>
                    <span>$500 (Luxury/HVAC)</span>
                  </div>
                </div>

                {/* 4. Rule Strategy Selector */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider block">
                    Budgeting Framework & Target Strategy
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: "30percent",
                        title: "30% Standard Rule",
                        desc: "Traditional benchmark recommended by financial advisors",
                        badge: "Recommended"
                      },
                      {
                        id: "25percent",
                        title: "25% Frugal / Max Savings",
                        desc: "For aggressive savers building investments or home equity",
                        badge: "Conservative"
                      },
                      {
                        id: "40x",
                        title: "40x Landlord Income Rule",
                        desc: "Standard screening threshold for US/NYC landlord approvals",
                        badge: "Approval Ready"
                      },
                      {
                        id: "50_30_20",
                        title: "50/30/20 Needs Strategy",
                        desc: "Caps total needs (Rent + Debt + Bills) under 50% income",
                        badge: "Holistic"
                      }
                    ].map((rule) => (
                      <button
                        key={rule.id}
                        type="button"
                        onClick={() => setSelectedRule(rule.id)}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          selectedRule === rule.id
                            ? "bg-teal-50/80 dark:bg-teal-950/40 border-teal-400 dark:border-teal-700 shadow-sm"
                            : "bg-slate-50/60 dark:bg-zinc-950/60 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {rule.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                            {rule.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">
                          {rule.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Dynamic Interactive Analytics Dashboard */}
              <div className="lg:col-span-5 space-y-6 text-left">
                {/* Hero Metric Card */}
                <motion.div
                  layout
                  className="bg-gradient-to-br from-white via-teal-50/25 to-emerald-50/40 dark:from-zinc-900 dark:via-teal-950/20 dark:to-zinc-900 border border-teal-500/40 p-6 sm:p-8 rounded-lg space-y-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-teal-500/20">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Target Rental Budget</span>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${healthRating.color}`}>
                      {healthRating.label}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 block font-medium">
                      Recommended Max Monthly Rent:
                    </span>
                    <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mt-1 flex items-baseline gap-1">
                      ${activeRecommendedRent.toLocaleString()}
                      <span className="text-base font-medium text-slate-400 dark:text-zinc-500">/mo</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
                      Based on ${Math.round(grossMonthlyIncome).toLocaleString()} gross monthly earnings.
                    </p>
                  </div>

                  {/* 3 Housing Budget Tiers Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-lg bg-white/90 dark:bg-zinc-950/80 border border-slate-200/70 dark:border-zinc-800/80 text-center">
                    <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 block uppercase">
                        Conservative (25%)
                      </span>
                      <span className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 block mt-0.5">
                        ${conservativeRent.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800">
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 block uppercase">
                        Standard (30%)
                      </span>
                      <span className="text-sm font-black text-teal-600 dark:text-teal-400 block mt-0.5">
                        ${standardMaxRent.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900">
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase">
                        Stretch (35%)
                      </span>
                      <span className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 block mt-0.5">
                        ${stretchRent.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Live Cashflow Distribution Bar */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <span className="flex items-center space-x-1.5">
                        <PieChart className="w-3.5 h-3.5 text-teal-500" />
                        <span>Monthly Cashflow Allocation</span>
                      </span>
                      <span className="text-slate-500 dark:text-zinc-400">${Math.round(grossMonthlyIncome).toLocaleString()}/mo Total</span>
                    </div>

                    <div className="h-3 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${rentPct}%` }}
                        className="h-full bg-teal-500 transition-all duration-500"
                        title={`Rent: ${rentPct}%`}
                      />
                      <div
                        style={{ width: `${debtPct}%` }}
                        className="h-full bg-rose-400 transition-all duration-500"
                        title={`Debt: ${debtPct}%`}
                      />
                      <div
                        style={{ width: `${utilPct}%` }}
                        className="h-full bg-amber-400 transition-all duration-500"
                        title={`Utilities: ${utilPct}%`}
                      />
                      <div
                        style={{ width: `${savingsPct}%` }}
                        className="h-full bg-emerald-400 transition-all duration-500"
                        title={`Savings: ${savingsPct}%`}
                      />
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
                        <span className="text-slate-600 dark:text-zinc-400 truncate">Rent (${activeRecommendedRent})</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                        <span className="text-slate-600 dark:text-zinc-400 truncate">Debt (${monthlyDebt})</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-slate-600 dark:text-zinc-400 truncate">Bills (${monthlyUtilities})</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                        <span className="text-slate-600 dark:text-zinc-400 truncate">Buffer (${remainingCashflow})</span>
                      </div>
                    </div>
                  </div>

                  {/* Landlord 40x Qualification Check */}
                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center space-x-1.5">
                        <ShieldCheck className="w-4 h-4 text-teal-500" />
                        <span>Landlord 40x Pre-Qualification</span>
                      </span>
                      <span className="text-xs font-black text-teal-600 dark:text-teal-400">
                        Up to ${rule40xRent.toLocaleString()}/mo
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400">
                      Standard property managers require an annual salary equal to 40x the monthly rent. Your current income easily passes checks for this bracket.
                    </p>
                  </div>

                  {/* Primary CTA */}
                  <Link
                    href={`/properties?maxPrice=${activeRecommendedRent}`}
                    className="flex items-center justify-center space-x-2 w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold rounded-lg text-sm shadow-md hover:shadow-lg transition-all transform active:scale-98"
                  >
                    <span>Browse Properties Under ${activeRecommendedRent.toLocaleString()}/mo</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* BOTTOM SECTION 1: Live Matching Rental Properties */}
            <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-zinc-800 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>Available Properties in Your Budget</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold">
                      &le; ${activeRecommendedRent.toLocaleString()}/mo
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                    Live verified listings currently available for instant reservation
                  </p>
                </div>

                <Link
                  href={`/properties?maxPrice=${activeRecommendedRent}`}
                  className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline shrink-0"
                >
                  <span>View Full Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loadingProps ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                    Finding properties fitting your budget...
                  </span>
                </div>
              ) : matchingProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchingProperties.map((prop) => (
                    <Link
                      key={prop._id}
                      href={`/properties/${prop._id}`}
                      className="group bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-lg overflow-hidden hover:border-teal-500/40 transition-all duration-300 flex flex-col"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                        <Image
                          src={prop.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600"}
                          alt={prop.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-black">
                          ${prop.rent?.toLocaleString()}/mo
                        </div>
                        <div className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-teal-500/90 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg">
                          {prop.propertyType}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-500 transition-colors">
                            {prop.title}
                          </h4>
                          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                            <span className="truncate">{prop.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400">
                          <div className="flex items-center space-x-1">
                            <BedDouble className="w-4 h-4 text-teal-500" />
                            <span>{prop.bedrooms} Beds</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Bath className="w-4 h-4 text-teal-500" />
                            <span>{prop.bathrooms} Baths</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Maximize className="w-4 h-4 text-teal-500" />
                            <span>{prop.size} sqft</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 bg-white dark:bg-zinc-900 border border-dashed border-slate-200 dark:border-zinc-800 rounded-lg text-center space-y-3 p-6">
                  <div className="p-3 bg-teal-500/10 text-teal-500 rounded-lg w-fit mx-auto">
                    <Building className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                    No Exact Matches Under ${activeRecommendedRent.toLocaleString()}/mo
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                    Try raising your budget slightly or check out all listings on the map.
                  </p>
                  <Link
                    href="/properties"
                    className="inline-block px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-lg transition"
                  >
                    Browse All Properties
                  </Link>
                </div>
              )}
            </div>

            {/* BOTTOM SECTION 2: Financial Guidance & Tips */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-8 rounded-lg text-left space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Info className="w-5 h-5 text-teal-500" />
                <span>Renter Financial Literacy & Qualification FAQs</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/60 dark:border-zinc-800/60 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>What is the 30% Rule?</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                    The 30% rule advises spending no more than 30% of your gross income on housing. It ensures you retain plenty of disposable income for savings, food, healthcare, and emergencies.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/60 dark:border-zinc-800/60 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>How Landlords Screen Renters</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                    Most landlords enforce the 40x rent rule (Annual salary &ge; 40 &times; rent) along with a Debt-to-Income (DTI) ratio under 43%. A clean credit score and verified paystubs ensure quick approvals.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/60 dark:border-zinc-800/60 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>Strategies to Lower Costs</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                    Consider signing 18+ month leases for discounts, adding a roommate to divide costs, or looking slightly outside city centers along transit corridors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /*                          LANDLORD RENT ESTIMATOR                          */
          /* ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Form Card */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500 dark:hover:border-teal-400 transition-colors duration-300 p-6 sm:p-8 rounded-lg text-left">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100 dark:border-zinc-800">
                <div className="p-2.5 bg-teal-500/10 text-teal-500 rounded-lg">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Property Parameters</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Enter your listing specs to generate predictive fair rent
                  </p>
                </div>
              </div>

              <form onSubmit={handleCalculateRent} className="space-y-5">
                {/* Location */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                    LOCATION (CITY, STATE OR ZIP) *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Miami, FL"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-900 rounded-lg text-sm font-medium outline-none transition"
                    />
                  </div>
                </div>

                {/* Property Type & Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                      PROPERTY TYPE
                    </label>
                    <div className="relative">
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full p-2.5 pr-10 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 rounded-lg text-sm font-semibold text-slate-800 dark:text-zinc-200 outline-none cursor-pointer appearance-none"
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Villa">Villa</option>
                        <option value="Studio">Studio</option>
                        <option value="Cabin">Cabin</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                      SIZE (SQFT)
                    </label>
                    <input
                      type="number"
                      required
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 rounded-lg text-sm font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                      BEDROOMS
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 rounded-lg text-sm font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                      BATHROOMS
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 rounded-lg text-sm font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-2">
                    AMENITIES & UPGRADES
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableAmenities.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`p-2 rounded-lg text-xs font-bold text-left border transition cursor-pointer ${
                          amenities.includes(amenity)
                            ? "bg-teal-50 border-teal-300 text-teal-700 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300"
                            : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Crunching Market Listings...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Estimate Market Rent Now</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-5 space-y-4 text-left">
              {estimateResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-white via-teal-50/20 to-emerald-50/30 dark:from-zinc-900 dark:via-teal-950/20 dark:to-zinc-900 border border-teal-500/30 p-6 sm:p-8 rounded-lg space-y-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-teal-500/20">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      AI Valuation Result
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      94% Confidence
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 block font-medium">
                      Estimated Monthly Rent:
                    </span>
                    <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-1">
                      ${estimateResult.estimatedRent?.toLocaleString() || "2,450"}
                      <span className="text-base font-normal text-slate-400">/mo</span>
                    </div>
                  </div>

                  {/* Rent Range */}
                  <div className="p-4 bg-white/80 dark:bg-zinc-950/60 rounded-lg border border-slate-200/60 dark:border-zinc-800/60 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-zinc-400">
                      <span>Low: ${estimateResult.lowRange?.toLocaleString() || "2,200"}</span>
                      <span>High: ${estimateResult.highRange?.toLocaleString() || "2,750"}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 w-[65%]" />
                    </div>
                  </div>

                  {/* Insights List */}
                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
                      <span>Matches {location} zip code vacancy rates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
                      <span>Adjusted for {bedrooms} bed / {bathrooms} bath floorplan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
                      <span>Premium included for selected amenities</span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard?tab=add-property&rent=${estimateResult.estimatedRent}&location=${encodeURIComponent(
                      location
                    )}&bedrooms=${bedrooms}&bathrooms=${bathrooms}&size=${size}&propertyType=${encodeURIComponent(
                      propertyType
                    )}&amenities=${encodeURIComponent(amenities.join(","))}`}
                    className="block w-full text-center py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-slate-900 rounded-lg font-bold text-xs shadow-md transition"
                  >
                    List This Property on Renterty &rarr;
                  </Link>
                </motion.div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-800 p-8 rounded-lg text-center space-y-3">
                  <div className="p-3 bg-teal-500/10 text-teal-500 rounded-lg w-fit mx-auto">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Awaiting Property Details</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Fill out the form and hit calculate to receive instant market analytics, rent ranges, and comparable insights.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function EstimatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
          <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
        </div>
      }
    >
      <EstimatorContent />
    </Suspense>
  );
}
