"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { aiEstimateRent } from "@/lib/ai";
import toast from "react-hot-toast";
import {
  Building2,
  ShieldCheck,
  CreditCard,
  FileSignature,
  Wrench,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronDown,
  Lock,
  Headphones,
  Loader2,
  Calculator,
  DollarSign,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandlordsPage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  // Embedded Quick Estimator State
  const [estLocation, setEstLocation] = useState("Miami, FL");
  const [estType, setEstType] = useState("Apartment");
  const [estBedrooms, setEstBedrooms] = useState(2);
  const [estBathrooms, setEstBathrooms] = useState(2);
  const [estSize, setEstSize] = useState(1100);
  const [estLoading, setEstLoading] = useState(false);
  const [estResult, setEstResult] = useState(null);

  const handleQuickEstimate = async (e) => {
    e.preventDefault();
    if (!estLocation) {
      toast.error("Please enter a property location");
      return;
    }

    setEstLoading(true);
    try {
      const res = await aiEstimateRent({
        location: estLocation,
        propertyType: estType,
        bedrooms: Number(estBedrooms),
        bathrooms: Number(estBathrooms),
        size: Number(estSize),
        amenities: ["Wifi", "Air Conditioning"]
      });

      if (res.success && res.data) {
        setEstResult(res.data);
        toast.success("AI valuation calculated!");
      } else {
        throw new Error(res.error || "Failed to calculate estimate");
      }
    } catch (err) {
      toast.error(err.message || "Failed to estimate rent");
    } finally {
      setEstLoading(false);
    }
  };

  const scrollToCalculator = () => {
    document.getElementById("valuation-calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  const faqs = [
    {
      q: "How much does it cost to list properties on Renterty?",
      a: "Listing your property on Renterty is 100% free with zero upfront charges. We only process standard Stripe transaction fees when tenants pay their reservation deposits or rent online."
    },
    {
      q: "How do Digital Leases & E-Signatures work?",
      a: "You can generate customizable digital residential leases directly inside your Owner Dashboard. Once you input the lease terms, your tenant can sign digitally, and both parties can download the official PDF lease agreement."
    },
    {
      q: "How does AI Maintenance Triaging assist landlords?",
      a: "When tenants submit a repair request, our AI Vision & Triaging engine automatically grades the urgency (Low, Moderate, Urgent, Critical Emergency), drafts contractor troubleshooting steps, and notifies you immediately."
    },
    {
      q: "When do I receive rental payments?",
      a: "All online payments are processed securely via Stripe and deposited directly into your linked bank account with full ledger tracking in your Owner Analytics tab."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-10 sm:py-16 px-3.5 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-500/15 via-emerald-500/5 to-transparent dark:from-teal-950/40 dark:via-zinc-950 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[10px] sm:text-xs font-bold uppercase tracking-wide max-w-full">
            <Building2 className="h-3.5 w-3.5 text-teal-500 shrink-0" />
            <span className="truncate">Built for Landlords & Property Managers</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight px-1">
            List for Free. Lease Faster.{" "} <br className="hidden xs:inline sm:inline" />
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Manage Everything in One Place
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed px-1">
            Automated rent collection, instant legal e-leases, AI maintenance triage, and verified tenant screening — built to save you 15+ hours every month.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <Link
              href={user ? "/dashboard?tab=add-property" : "/register"}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-teal-500/20"
            >
              <span>List Your Property Today</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={scrollToCalculator}
              className="w-full sm:w-auto px-5 py-3.5 sm:px-6 sm:py-4 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-teal-500" />
              <span>Calculate Rental Value</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Bento Grid */}
      <section className="py-8 sm:py-14 w-[90%] mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 bg-gradient-to-r from-teal-500/15 via-emerald-500/15 to-teal-500/15 text-teal-700 dark:text-teal-300 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider border border-teal-500/30 shadow-xs backdrop-blur-md">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-teal-500 shrink-0" />
            <span>Landlord Suite & Automation</span>
          </div>
          <h2 className="mt-2 text-xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Powerful Tools to Scale Your Portfolio
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-zinc-400 max-w-4xl mx-auto">
            Streamline your operations with intelligent tools built specifically for property owners and managers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 md:auto-rows-[290px]">
          {/* Hero Card - Large (2 cols x 2 rows) */}
          <div className="md:col-span-2 md:row-span-2 min-h-[300px] sm:min-h-[380px] md:min-h-0 bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 rounded-lg p-5 sm:p-8 md:p-10 text-white flex flex-col justify-end relative overflow-hidden group border border-teal-500/20 shadow-lg">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-2.5 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/15 backdrop-blur-md rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-sm font-semibold border border-white/20">
                <span className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>Smart Portfolio Operations</span>
              </div>
              <h3 className="text-xl sm:text-3xl md:text-5xl font-bold tracking-tight leading-tight text-white">
                Automate Leases,
                <br />
                Screening & Payouts
              </h3>
              <p className="max-w-xl text-slate-200 dark:text-zinc-200 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                Save 15+ hours each month with direct Stripe deposits, instant legal <br /> e-leases, AI maintenance triage, and verified tenant matching.
              </p>
            </div>
          </div>

          {/* Stats Card 1 (Col 3, Row 1) */}
          <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 rounded-lg p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 border border-teal-400/20 text-white min-h-[190px] sm:min-h-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-teal-900/40 to-transparent" />
            <div className="absolute -right-8 -top-8 size-32 bg-white/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
            <div className="relative z-10">
              <div className="size-11 sm:size-14 text-white rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 border border-white/20">
                <CreditCard className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-1">
                $4.8M+
              </h4>
              <p className="text-teal-100 font-semibold text-xs sm:text-base">
                Direct Stripe Rent Collected
              </p>
            </div>
            <div className="relative z-10 pt-2 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-teal-200 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>Instant Payouts & Reports</span>
            </div>
          </div>

          {/* Feature Card (Col 3, Row 2) */}
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg p-5 sm:p-7 flex flex-col justify-between border border-slate-200/80 dark:border-zinc-800/80 transition-all duration-300 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 group relative overflow-hidden min-h-[190px] sm:min-h-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-15 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 dark:to-transparent" />
            <div className="relative z-10 size-11 sm:size-13 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold shadow-sm shadow-teal-500/20 group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-1.5 sm:space-y-2 relative z-10">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Automated Routing
              </span>
              <h4 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                AI Maintenance Triage
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2 sm:line-clamp-3">
                AI classifies repair emergencies, suggests troubleshooting steps, and organizes work tickets automatically.
              </p>
            </div>
          </div>

          {/* CTA Card (Col 1, Row 3) */}
          <Link
            href={user ? "/dashboard?tab=add-property" : "/register?role=Owner"}
            className="bg-gradient-to-br from-slate-950 to-slate-900 dark:from-zinc-900 dark:to-zinc-950 rounded-lg p-5 sm:p-7 text-white flex flex-col justify-between transition-all duration-300 cursor-pointer group border border-slate-800 dark:border-zinc-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden min-h-[180px] sm:min-h-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            <div className="flex justify-between items-start relative z-10">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/15 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-white/10 text-teal-300">
                Join Now
              </span>
              <div className="size-9 sm:size-11 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-base sm:text-xl group-hover:bg-teal-500 group-hover:text-white group-hover:rotate-45 transition-all duration-300 border border-white/10">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1 relative z-10">
              <h4 className="text-xl sm:text-3xl font-bold leading-tight text-white group-hover:text-teal-300 transition-colors">
                List Your Rental Property
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Create digital leases and publish listings in 2 minutes.
              </p>
            </div>
          </Link>

          {/* Stats Card 2 (Col 2, Row 3) */}
          <div className="bg-slate-950 dark:bg-zinc-900 rounded-lg p-5 sm:p-7 text-white flex flex-col justify-center gap-2 relative overflow-hidden group border border-slate-800 dark:border-zinc-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 transition-all min-h-[160px] sm:min-h-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />
            <span className="absolute top-4 right-4 sm:top-5 sm:right-5 flex size-3 z-10">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-teal-500" />
            </span>
            <div className="relative z-10">
              <span className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-teal-200 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                24,500+
              </span>
              <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-300 dark:text-zinc-300 font-semibold mt-1.5 sm:mt-2.5">
                Active Verified Tenants
              </p>
            </div>
          </div>

          {/* Stats Card 3 (Col 3, Row 3) */}
          <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-lg p-5 sm:p-7 text-white flex flex-col justify-center gap-2 relative overflow-hidden group transition-all duration-300 border border-teal-400/30 min-h-[160px] sm:min-h-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-teal-900/40 to-transparent" />
            <div className="absolute -bottom-10 -right-10 size-40 bg-white/15 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
            <div className="relative z-10">
              <span className="text-3xl sm:text-5xl font-bold text-white">99.4%</span>
              <p className="text-xs sm:text-sm uppercase tracking-widest text-teal-50 font-semibold mt-1.5 sm:mt-2.5">
                Satisfaction & Payout Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded AI Rent Calculator Section */}
      <section id="valuation-calculator" className="py-8 sm:py-16 w-[90%] mx-auto scroll-mt-20">
        <div className="bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent dark:from-teal-950/40 dark:via-zinc-900 border border-teal-500/20 dark:border-teal-800/40 rounded-lg p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-8">
          <div className="text-center flex flex-col items-center justify-center pb-4 sm:pb-6 border-b border-teal-500/20 dark:border-zinc-800">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[10px] sm:text-xs font-bold mb-2">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-teal-500 shrink-0" />
                <span>INSTANT LANDLORD VALUATION</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Calculate What Your Property Should Rent For
              </h2>
              <p className="text-xs sm:text-base text-slate-500 dark:text-zinc-400 max-w-4xl mx-auto mt-1">
                Real-time valuation based on zip-code market comps, active inventory, and property characteristics
              </p>
            </div>
          </div>

          <form onSubmit={handleQuickEstimate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div>
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                LOCATION / CITY
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                <input
                  type="text"
                  value={estLocation}
                  onChange={(e) => setEstLocation(e.target.value)}
                  placeholder="e.g. Miami, FL"
                  className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 rounded-xl text-xs font-bold outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                PROPERTY TYPE
              </label>
              <div className="relative">
                <select
                  value={estType}
                  onChange={(e) => setEstType(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 sm:py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Studio">Studio</option>
                  <option value="Townhouse">Townhouse</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                BEDROOMS
              </label>
              <div className="relative">
                <select
                  value={estBedrooms}
                  onChange={(e) => setEstBedrooms(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2 sm:py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer"
                >
                  <option value="1">1 Bed</option>
                  <option value="2">2 Beds</option>
                  <option value="3">3 Beds</option>
                  <option value="4">4+ Beds</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                BATHROOMS
              </label>
              <div className="relative">
                <select
                  value={estBathrooms}
                  onChange={(e) => setEstBathrooms(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2 sm:py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer"
                >
                  <option value="1">1 Bath</option>
                  <option value="2">2 Baths</option>
                  <option value="3">3 Baths</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                SIZE (SQ FT)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={estSize}
                  onChange={(e) => setEstSize(Number(e.target.value))}
                  placeholder="1100"
                  className="w-full px-3 py-2 sm:py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 rounded-xl text-xs font-bold outline-none"
                />
                <button
                  type="submit"
                  disabled={estLoading}
                  className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer"
                >
                  {estLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </form>

          {/* Quick Valuation Results Display */}
          {estResult ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-6 bg-white dark:bg-zinc-900 border border-teal-500/30 rounded-lg space-y-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100 dark:border-zinc-800">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold text-teal-600 dark:text-teal-400 block">
                    Recommended Monthly Rental Target
                  </span>
                  <span className="text-2xl sm:text-4xl font-bold text-teal-600 dark:text-teal-400 block mt-0.5">
                    ${estResult.estimatedRent?.toLocaleString()}
                    <span className="text-xs sm:text-sm font-medium text-slate-400">/month</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 text-left">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block">Suggested Range</span>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-zinc-200">
                      ${estResult.suggestedRange?.min?.toLocaleString()} – ${estResult.suggestedRange?.max?.toLocaleString()}
                    </span>
                  </div>

                  <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 text-left">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block">Market Confidence</span>
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {estResult.confidence}% ({estResult.comparablesCount} comps)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-1">
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xl text-left">
                  💡 {estResult.marketSummary}
                </p>

                <Link
                  href={
                    user
                      ? `/dashboard?tab=add-property&rent=${estResult.estimatedRent}&location=${encodeURIComponent(
                          estLocation
                        )}&bedrooms=${estBedrooms}&bathrooms=${estBathrooms}&size=${estSize}&propertyType=${encodeURIComponent(
                          estType
                        )}`
                      : `/register?role=Owner`
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold text-xs transition shrink-0"
                >
                  <span>List with this Rent (${estResult.estimatedRent?.toLocaleString()}/mo)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="p-4 bg-white/60 dark:bg-zinc-900/60 border border-dashed border-teal-500/20 rounded-lg text-center">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                Enter your property details above and click the sparkle button to get your real-time valuation and list immediately
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 px-3.5 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8 space-y-1">
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">Common questions from property owners and hosts</p>
        </div>

        <div className="space-y-2.5 sm:space-y-3 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-3.5 sm:p-5 flex items-center justify-between text-left font-bold text-xs sm:text-base text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition gap-2"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-teal-500" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800/50 pt-2.5 sm:pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-8 sm:py-14 w-[90%] mx-auto pb-20 sm:pb-14">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 dark:from-zinc-950 dark:via-teal-950/80 dark:to-zinc-950 text-white border border-teal-500/30 p-5 sm:p-8 lg:p-10 xl:p-14 text-center group shadow-2xl">
          {/* 1. High-Res Luxury Architectural Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-1000 ease-out pointer-events-none"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80')"
            }}
          />

          {/* 2. Layered Vignette Overlays & Glow Orbs */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -left-24 size-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -bottom-24 -right-24 size-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          {/* 3. Tech Dot Matrix Texture */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "28px 28px"
            }}
          />

          {/* 4. Floating UI Elements on Left & Right Sides (Visible on Laptop & Desktop with proportional scaling) */}
          {/* Left Floating Element: Live Payout notification */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:flex absolute left-3 lg:left-4 xl:left-8 2xl:left-12 top-1/2 -translate-y-1/2 -rotate-3 hover:rotate-0 transition-all duration-300 p-3 xl:p-4 rounded-lg bg-slate-900/90 backdrop-blur-xl border border-teal-500/30 shadow-2xl items-center gap-2.5 xl:gap-3.5 text-left max-w-[230px] xl:max-w-xs pointer-events-auto scale-[0.82] lg:scale-[0.84] xl:scale-95 2xl:scale-100 origin-left"
          >
            <div className="size-9 xl:size-11 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
              <DollarSign className="w-5 h-5 xl:w-6 xl:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[10px] xl:text-[11px] font-bold text-emerald-400 uppercase tracking-wider truncate">Instant Payout</span>
              </div>
              <p className="text-xs xl:text-sm font-extrabold text-white mt-0.5 whitespace-nowrap">+$3,850.00 Deposited</p>
              <span className="text-[9px] xl:text-[10px] text-slate-400 block truncate">Direct to Stripe • Just now</span>
            </div>
          </motion.div>

          {/* Right Floating Element: Verified Lease notification */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex absolute right-3 lg:right-4 xl:right-8 2xl:right-12 top-1/2 -translate-y-1/2 rotate-3 hover:rotate-0 transition-all duration-300 p-3 xl:p-4 rounded-lg bg-slate-900/90 backdrop-blur-xl border border-teal-500/30 shadow-2xl items-center gap-2.5 xl:gap-3.5 text-left max-w-[230px] xl:max-w-xs pointer-events-auto scale-[0.82] lg:scale-[0.84] xl:scale-95 2xl:scale-100 origin-right"
          >
            <div className="size-9 xl:size-11 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-teal-500/20">
              <FileSignature className="w-5 h-5 xl:w-6 xl:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="text-[10px] xl:text-[11px] font-bold text-teal-300 uppercase tracking-wider truncate">Verified Lease</span>
              </div>
              <p className="text-xs xl:text-sm font-extrabold text-white mt-0.5 whitespace-nowrap">Digital Lease E-Signed</p>
              <span className="text-[9px] xl:text-[10px] text-slate-400 block truncate">12-Month Term • Automated</span>
            </div>
          </motion.div>

          {/* 5. Center Call-to-Action Content */}
          <div className="relative z-10 max-w-md sm:max-w-lg lg:max-w-md xl:max-w-xl 2xl:max-w-2xl mx-auto space-y-2.5 sm:space-y-3 px-2">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-teal-400 shrink-0" />
              <span>Smart Landlord Automation</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-snug sm:leading-tight text-white">
              Ready to automate your rentals with{" "}
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                zero hassle?
              </span>
            </h2>

            <p className="text-xs sm:text-sm lg:text-xs xl:text-base text-slate-300 dark:text-zinc-300 leading-relaxed max-w-sm sm:max-w-md lg:max-w-sm xl:max-w-lg 2xl:max-w-xl mx-auto">
              Join thousands of landlords who automate screening, digital leases, and direct payouts in one seamless platform
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-1 w-full max-w-full mx-auto">
              <Link
                href={user ? "/dashboard?tab=add-property" : "/register?role=Owner"}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 xl:px-8 xl:py-3.5 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-bold rounded-xl sm:rounded-2xl text-xs xl:text-sm transition-all duration-300 shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-1.5 sm:space-x-2 group/btn cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>List Your Property Today</span>
                <ArrowRight className="h-3.5 w-3.5 xl:h-4 xl:w-4 group-hover/btn:translate-x-1 transition-transform shrink-0" />
              </Link>
              <button
                type="button"
                onClick={scrollToCalculator}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 xl:px-7 xl:py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-xl sm:rounded-2xl text-xs xl:text-sm transition-all backdrop-blur-md flex items-center justify-center space-x-1.5 sm:space-x-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Calculator className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-teal-400 shrink-0" />
                <span>Calculate Rental Value</span>
              </button>
            </div>
          </div>

          {/* 6. Live Trust Indicators */}
          <div className="relative z-10 max-w-3xl mx-auto mt-4 sm:mt-5 xl:mt-6 pt-4 sm:pt-5 xl:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 xl:gap-8 text-[11px] sm:text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Instant Stripe Payouts</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Bank-Grade 256-Bit Security</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <Wrench className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>24/7 AI Maintenance Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
