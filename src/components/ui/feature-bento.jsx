"use client";

import React from "react";
import Link from "next/link";
import {
  CreditCard,
  FileSignature,
  Wrench,
  Sparkles,
  ShieldCheck,
  Building,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Users
} from "lucide-react";

export const FeatureBento = ({
  title = "Everything You Need to Scale Your Rental Portfolio",
  subtitle = "Streamline your operations with intelligent tools built specifically for modern property owners and managers.",
  badge = "Landlord Operating System",
  heroBadge = "Live Smart Management",
  heroTitle = "Automate Rent Collection & Leases",
  heroDescription = "Save 15+ hours each month with direct Stripe deposits, instant legal e-leases, and automated tenant screening.",
  heroImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=80",
  ctaLink = "/register?role=Owner",
  ctaText = "List Your First Property",
  ctaBadge = "Get Started"
}) => {
  return (
    <section className="py-12 sm:py-16 w-full">
      <div className="w-[90%] max-w-7xl mx-auto">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
            {badge && (
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-gradient-to-r from-teal-500/15 via-emerald-500/15 to-teal-500/15 text-teal-700 dark:text-teal-300 rounded-full text-xs font-semibold uppercase tracking-wider border border-teal-500/30 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-teal-500" />
                <span>{badge}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <p className="text-base text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        )}

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:auto-rows-[290px]">
          {/* 1. Hero Card - Large (2 cols x 2 rows) */}
          <div className="md:col-span-2 md:row-span-2 min-h-[380px] md:min-h-0 bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 rounded-lg p-7 sm:p-10 text-white flex flex-col justify-end relative overflow-hidden group border border-teal-500/20">
            {/* Background Image with Zoom */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-35 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{ backgroundImage: `url('${heroImage}')` }}
            />
            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold border border-white/20">
                <span className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>{heroBadge}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {heroTitle}
              </h3>
              <p className="max-w-xl text-slate-200 dark:text-zinc-200 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                {heroDescription}
              </p>
            </div>
          </div>

          {/* 2. Stats Card 1 (Col 3, Row 1) */}
          <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 rounded-lg p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 border border-teal-400/20 text-white">
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
              <div className="size-14 text-white rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl mb-4 border border-white/20">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-1.5">
                $4.8M+
              </h4>
              <p className="text-teal-100 font-semibold text-sm sm:text-base">
                Direct Stripe Rent Collected
              </p>
            </div>
            <div className="relative z-10 pt-2 flex items-center gap-1.5 text-xs font-bold text-teal-200 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span>Instant Payouts & Reports</span>
            </div>
          </div>

          {/* 3. Feature Card (Col 3, Row 2) */}
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg p-7 sm:p-8 flex flex-col justify-between border border-slate-200/80 dark:border-zinc-800/80 transition-all duration-300 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 group relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-15 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 dark:to-transparent" />
            <div className="relative z-10 size-13 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold shadow-teal-500/20 group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Smart Dispatch
              </span>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                AI Maintenance Triage
              </h4>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2 sm:line-clamp-3">
                AI classifies repair emergencies, suggests troubleshooting steps, and organizes work tickets automatically.
              </p>
            </div>
          </div>

          {/* 4. CTA Card (Col 1, Row 3) */}
          <Link
            href={ctaLink}
            className="bg-gradient-to-br from-slate-950 to-slate-900 dark:from-zinc-900 dark:to-zinc-950 rounded-lg p-7 sm:p-8 text-white flex flex-col justify-between transition-all duration-300 cursor-pointer group border border-slate-800 dark:border-zinc-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden"
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
              <span className="text-xs font-bold uppercase tracking-wider bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10 text-teal-300">
                {ctaBadge}
              </span>
              <div className="size-11 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-xl group-hover:bg-teal-500 group-hover:text-white group-hover:rotate-45 transition-all duration-300 border border-white/10">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1.5 relative z-10">
              <h4 className="text-2xl sm:text-3xl font-bold leading-tight text-white group-hover:text-teal-300 transition-colors">
                {ctaText}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Create digital leases, list units, and invite verified renters in minutes.
              </p>
            </div>
          </Link>

          {/* 5. Stats Card 2 (Col 2, Row 3) */}
          <div className="bg-slate-950 dark:bg-zinc-900 rounded-lg p-7 sm:p-8 text-white flex flex-col justify-center gap-2 relative overflow-hidden group border border-slate-800 dark:border-zinc-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 transition-all duration-300">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />
            <span className="absolute top-5 right-5 flex size-3 z-10">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-teal-500" />
            </span>
            <div className="relative z-10">
              <span className="text-5xl font-bold bg-gradient-to-r from-teal-200 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                24,500+
              </span>
              <p className="text-sm uppercase tracking-widest text-slate-300 dark:text-zinc-300 font-semibold mt-2.5">
                Verified Resident Base
              </p>
            </div>
          </div>

          {/* 6. Stats Card 3 (Col 3, Row 3) */}
          <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-lg p-7 sm:p-8 text-white flex flex-col justify-center gap-2 relative overflow-hidden group transition-all duration-300 border border-teal-400/30">
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
              <span className="text-5xl font-bold text-white">99.4%</span>
              <p className="text-sm uppercase tracking-widest text-teal-50 font-semibold mt-2.5">
                Satisfaction & Payout Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureBento;
