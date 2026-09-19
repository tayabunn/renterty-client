"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  CalendarCheck,
  CreditCard,
  KeyRound,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Building,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Calculator
} from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tenant"); // "tenant" | "owner"

  const tenantSteps = [
    {
      step: "01",
      title: "Discover & Filter Smart Listings",
      desc: "Search by neighborhood, budget, and desired amenities. Use AI Smart Search or the Interactive Map to inspect walkability and schools.",
      icon: Search,
      highlight: "AI Neighborhood Scores & Filters"
    },
    {
      step: "02",
      title: "Book Tours & Connect with Landlords",
      desc: "Schedule in-person or live video walkthroughs directly on the owner's calendar. Message landlords securely in-app.",
      icon: CalendarCheck,
      highlight: "Live Tour Scheduling"
    },
    {
      step: "03",
      title: "E-Sign Digital Lease & Pay Online",
      desc: "Complete your booking with verified Stripe payment and sign legally binding residential leases directly on your screen.",
      icon: CreditCard,
      highlight: "Stripe Secured & Legal E-Leases"
    },
    {
      step: "04",
      title: "Move In & AI Maintenance",
      desc: "Receive your key handover and enjoy full access to 24/7 AI maintenance request dispatch throughout your tenancy.",
      icon: KeyRound,
      highlight: "Instant Maintenance Dispatch"
    }
  ];

  const ownerSteps = [
    {
      step: "01",
      title: "List with AI Copywriting & Valuation",
      desc: "Publish your listing in 2 minutes. Our AI assists with photo inspection, auto-generating descriptions, and calculating peak rental price.",
      icon: Sparkles,
      highlight: "AI Valuation & Rent Estimator"
    },
    {
      step: "02",
      title: "Review Verified Tenant Applications",
      desc: "Screen booking requests with full visibility into tenant move-in dates, contact profiles, and verified reviews.",
      icon: UserCheck,
      highlight: "Verified Resident Base"
    },
    {
      step: "03",
      title: "Generate Digital Leases & Collect Payouts",
      desc: "Send digital lease agreements for e-signatures. Receive security deposits and rent directly into your bank account via Stripe.",
      icon: FileCheck,
      highlight: "Automated Stripe Deposits"
    },
    {
      step: "04",
      title: "Manage Tickets & Monitor Analytics",
      desc: "Handle repair requests with AI urgency grading and track monthly earnings and booking metrics with downloadable PDF reports.",
      icon: Building,
      highlight: "Full Dashboard & PDF Reports"
    }
  ];

  const currentSteps = activeTab === "tenant" ? tenantSteps : ownerSteps;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-500/15 via-emerald-500/5 to-transparent dark:from-teal-950/40 dark:via-zinc-950 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold">
            <ShieldCheck className="h-4 w-4 text-teal-500" />
            <span>Seamless & Transparent Real Estate</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white">
            How <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">Renterty Works</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 max-w-xl mx-auto">
            From discovering your dream home to signing leases and managing rent payouts, here is how Renterty streamlines every step
          </p>

          {/* Interactive Switch */}
          <div className="inline-flex p-1.5 bg-slate-200/80 dark:bg-zinc-800 rounded-2xl gap-1 mt-2">
            <button
              onClick={() => setActiveTab("tenant")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "tenant"
                  ? "bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-sm"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              For Tenants & Renters
            </button>
            <button
              onClick={() => setActiveTab("owner")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "owner"
                  ? "bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-sm"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              For Property Owners
            </button>
          </div>
        </div>
      </section>

      {/* Step by Step Grid */}
      <section className="py-8 sm:py-12 w-[90%] mx-auto flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {currentSteps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.08 }}
                className="group bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 p-7 sm:p-9 rounded-lg relative overflow-hidden hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-colors duration-300 text-left flex flex-col justify-between"
              >
                {/* Corner Ambient Glow */}
                <div className="absolute -right-8 -top-8 size-32 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="size-14 text-white rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-2xl shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="px-3.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-full text-xs font-bold tracking-wider border border-slate-200/80 dark:border-zinc-700">
                      STEP {item.step}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 text-xs font-bold">
                      <span className="size-1.5 rounded-full bg-teal-500 animate-pulse" />
                      <span>{item.highlight}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white pt-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="text-center pt-10">
          {activeTab === "tenant" ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/properties"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl font-bold text-sm transition"
              >
                <span>Explore Verified Rentals</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/estimator?mode=affordability"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-2xl font-bold text-sm transition"
              >
                <Calculator className="h-4 w-4 text-teal-500" />
                <span>Calculate Your Budget</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={user ? "/dashboard?tab=add-property" : "/register"}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl font-bold text-sm transition"
              >
                <span>List Your Property Today</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/estimator?mode=landlord"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-2xl font-bold text-sm transition"
              >
                <Sparkles className="h-4 w-4 text-teal-500" />
                <span>Estimate Rental Income</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
