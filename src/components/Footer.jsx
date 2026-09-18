"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Check,
  ChevronUp,
  Globe,
  Activity,
  Home
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 3000);
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer 
      aria-label="Site Footer" 
      className="relative bg-slate-950 text-slate-300 dark:bg-zinc-950 dark:text-zinc-400 border-t border-slate-800/80 dark:border-zinc-800/80 pt-10 pb-8 overflow-hidden transition-colors duration-300 select-none"
    >
      {/* Ambient Top Glow / Radial Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-40 bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-[90%] mx-auto">
        
        {/* =========================================================================
            TOP ROW: Interactive Newsletter & AI Rental Concierge Value Proposition
           ========================================================================= */}
        <div className="mb-8 pb-8 border-b border-slate-800/80 dark:border-zinc-800/80">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/60 dark:from-zinc-950 dark:via-zinc-900 dark:to-teal-950/60 p-5 sm:p-7 md:p-8 rounded-lg border border-teal-500/25 dark:border-teal-500/20 backdrop-blur-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 md:gap-8">
            
            {/* --- PROPERTY & REAL ESTATE THEMED BACKGROUND GRAPHICS --- */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
              {/* Radial Lighting Cones */}
              <div className="absolute -top-24 -left-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-64 bg-teal-600/10 rounded-full blur-2xl" />

              {/* Architectural Blueprint Dot-Grid Mesh */}
              <div 
                className="absolute inset-0 opacity-[0.14] dark:opacity-[0.18]"
                style={{
                  backgroundImage: `radial-gradient(#14b8a6 1px, transparent 1px), radial-gradient(#059669 1px, transparent 1px)`,
                  backgroundSize: "28px 28px",
                  backgroundPosition: "0 0, 14px 14px"
                }}
              />

              {/* Glowing Top Edge Reflection */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

              {/* Smooth Dark Gradient from the Left for Text Contrast & Depth */}
              <div className="absolute inset-y-0 left-0 w-full sm:w-3/5 lg:w-1/2 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 z-[1]" />

              {/* Vector Architectural Real Estate & High-Rise Skyline Silhouette */}
              <svg
                className="absolute bottom-0 left-0 right-0 w-full h-44 sm:h-52 opacity-20 dark:opacity-30 pointer-events-none"
                viewBox="0 0 1200 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="skylineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#0f766e" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#042f2e" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="buildingStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0.1" />
                  </linearGradient>
                  <pattern id="windowPattern" width="14" height="14" patternUnits="userSpaceOnUse">
                    <rect x="2" y="2" width="4" height="4" rx="0.75" fill="#5eead4" fillOpacity="0.35" />
                    <rect x="8" y="2" width="4" height="4" rx="0.75" fill="#5eead4" fillOpacity="0.2" />
                    <rect x="2" y="8" width="4" height="4" rx="0.75" fill="#5eead4" fillOpacity="0.15" />
                    <rect x="8" y="8" width="4" height="4" rx="0.75" fill="#5eead4" fillOpacity="0.4" />
                  </pattern>
                </defs>

                {/* Background Far Buildings */}
                <path
                  d="M0 220 V140 H60 V100 H110 V130 H170 V90 H220 V150 H280 V110 H340 V80 H400 V120 H470 V95 H530 V140 H610 V85 H670 V125 H740 V75 H810 V115 H880 V90 H950 V135 H1020 V100 H1090 V145 H1150 V110 H1200 V220 Z"
                  fill="url(#skylineGrad)"
                />

                {/* Midground Apartment Complexes & Residential Towers with Windows */}
                <rect x="80" y="110" width="70" height="110" fill="url(#windowPattern)" stroke="url(#buildingStroke)" strokeWidth="1" />
                <rect x="230" y="95" width="80" height="125" fill="url(#windowPattern)" stroke="url(#buildingStroke)" strokeWidth="1" />
                <rect x="420" y="70" width="90" height="150" fill="url(#windowPattern)" stroke="url(#buildingStroke)" strokeWidth="1" />
                <polygon points="420,70 465,40 510,70" fill="url(#skylineGrad)" stroke="url(#buildingStroke)" strokeWidth="1" />
                
                <rect x="620" y="90" width="85" height="130" fill="url(#windowPattern)" stroke="url(#buildingStroke)" strokeWidth="1" />
                <rect x="790" y="65" width="75" height="155" fill="url(#windowPattern)" stroke="url(#buildingStroke)" strokeWidth="1" />
                {/* Spire on Tower */}
                <line x1="827.5" y1="65" x2="827.5" y2="35" stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.7" />
                <circle cx="827.5" cy="35" r="2.5" fill="#34d399" />

                <rect x="960" y="105" width="80" height="115" fill="url(#windowPattern)" stroke="url(#buildingStroke)" strokeWidth="1" />
                <rect x="1080" y="120" width="75" height="100" fill="url(#windowPattern)" stroke="url(#buildingStroke)" strokeWidth="1" />

                {/* Foreground Modern Gable-Roof Homes & Smart Rental Villas Silhouette */}
                <path
                  d="M-20 220 L30 170 L80 220 Z M160 220 L205 180 L250 220 Z M330 220 L385 170 L440 220 Z M520 220 L575 165 L630 220 Z M710 220 L760 175 L810 220 Z M890 220 L945 170 L1000 220 Z M1070 220 L1120 180 L1170 220 Z"
                  stroke="url(#buildingStroke)"
                  strokeWidth="1.2"
                  fill="url(#skylineGrad)"
                />

                {/* Smart Property Radar Pulse Rings in background */}
                <circle cx="465" cy="40" r="18" stroke="#14b8a6" strokeWidth="0.75" strokeOpacity="0.4" strokeDasharray="3 3" />
                <circle cx="465" cy="40" r="32" stroke="#14b8a6" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="4 4" />
                <circle cx="827.5" cy="35" r="14" stroke="#10b981" strokeWidth="0.75" strokeOpacity="0.5" strokeDasharray="2 2" />
                <circle cx="827.5" cy="35" r="28" stroke="#10b981" strokeWidth="0.75" strokeOpacity="0.25" strokeDasharray="3 3" />

                {/* Base Ground Horizon Line */}
                <line x1="0" y1="219" x2="1200" y2="219" stroke="#14b8a6" strokeWidth="1.5" strokeOpacity="0.3" />
              </svg>

              {/* Stylized Floating Property Geometry & Location Pin Watermark (Right Side) */}
              <div className="absolute right-4 -bottom-6 w-56 h-56 opacity-10 dark:opacity-15 text-teal-400 pointer-events-none">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M100 20 L170 80 L150 170 L50 170 L30 80 Z" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" />
                  <path d="M100 45 L150 90 L135 155 L65 155 L50 90 Z" stroke="currentColor" strokeWidth="1" />
                  <circle cx="100" cy="100" r="24" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M100 88 C93.37 88 88 93.37 88 100 C88 109 100 120 100 120 C100 120 112 109 112 100 C112 93.37 106.63 88 100 88 Z" fill="currentColor" />
                  <circle cx="100" cy="98" r="3" fill="#042f2e" />
                </svg>
              </div>
            </div>

            {/* --- FOREGROUND CONTENT (PRESERVED EXACTLY AS ORIGINAL) --- */}
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold tracking-wide backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
                <span>Next-Gen Rental Intelligence</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
                Stay updated on rental market drops &amp; smart lease alerts
              </h3>
              <p className="text-xs sm:text-sm text-slate-300/90 dark:text-zinc-300/90 leading-relaxed">
                Join renters and owners receiving automated valuation updates, instant verified rental drops, and zero-spam market insights.
              </p>

              {/* Social Proof Subscriber Avatar Stack */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Renter avatar 1" />
                  <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Renter avatar 2" />
                  <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Renter avatar 3" />
                  <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Renter avatar 4" />
                </div>
                <span className="text-[11px] font-medium text-slate-300 dark:text-zinc-300">
                  <strong className="text-teal-400 font-bold">25,000+</strong>
                  {" "}renters &amp; landlords subscribed
                </span>
              </div>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="relative z-10 w-full lg:w-auto lg:min-w-[380px] shrink-0">
              {subscribed ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-semibold backdrop-blur-md"
                >
                  <div className="p-1 rounded-full bg-emerald-500/20">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>You&apos;re subscribed! Welcome to Renterty Insider.</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5">
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                      className="w-full pl-4 pr-32 py-3.5 rounded-lg bg-slate-950/90 dark:bg-zinc-950/90 border border-slate-700/90 dark:border-zinc-700/90 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30 transition-all shadow-inner backdrop-blur-md"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 px-4 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md shadow-teal-500/25"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-400 px-1">
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3 text-teal-400" /> No spam, cancel anytime
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Weekly digest
                    </span>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* =========================================================================
            COMBINED & OPTIMIZED UTILITY HUB (Single Compact, Minimal & Responsive Row)
           ========================================================================= */}
        <div className="pb-6 space-y-5">
          
          {/* Main Combined Row: Contacts, Trust Badges & Socials */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 py-4 px-5 rounded-lg bg-slate-900/40 dark:bg-zinc-900/40 border border-slate-800/60 dark:border-zinc-800/60 text-xs text-slate-400 dark:text-zinc-400">
            
            {/* Direct Contact & Live Support */}
            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>24/7 Live Support</span>
              </div>

              <a href="mailto:support@renterty.com" className="flex items-center gap-1.5 hover:text-teal-300 transition-colors">
                <Mail className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>support@renterty.com</span>
              </a>

              <span className="text-slate-700 dark:text-zinc-700 hidden sm:inline">•</span>

              <a href="tel:+15551234567" className="flex items-center gap-1.5 hover:text-teal-300 transition-colors">
                <Phone className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </a>

              <span className="text-slate-700 dark:text-zinc-700 hidden md:inline">•</span>

              <a 
                href="https://maps.google.com/?q=San+Francisco,+CA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 hover:text-teal-300 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>San Francisco, CA</span>
              </a>
            </div>

            {/* Inline Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-slate-400 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-teal-400 shrink-0" />
                <span>256-Bit SSL</span>
              </div>
              <span className="text-slate-700 dark:text-zinc-700">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>Verified Landlords</span>
              </div>
              <span className="text-slate-700 dark:text-zinc-700 hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1.5">
                <Home className="h-3 w-3 text-cyan-400 shrink-0" />
                <span>Equal Housing</span>
              </div>
              <span className="text-slate-700 dark:text-zinc-700 hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1.5">
                <Activity className="h-3 w-3 text-violet-400 shrink-0" />
                <span>99.98% Uptime</span>
              </div>
            </div>

            {/* Compact Social Channels */}
            <div className="flex items-center gap-1.5">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-lg bg-slate-950/80 dark:bg-zinc-950/80 border border-slate-800 dark:border-zinc-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 hover:border-teal-500 transition-all active:scale-95"
                aria-label="X (formerly Twitter)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-lg bg-slate-950/80 dark:bg-zinc-950/80 border border-slate-800 dark:border-zinc-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 hover:border-teal-500 transition-all active:scale-95"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-lg bg-slate-950/80 dark:bg-zinc-950/80 border border-slate-800 dark:border-zinc-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 hover:border-teal-500 transition-all active:scale-95"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-lg bg-slate-950/80 dark:bg-zinc-950/80 border border-slate-800 dark:border-zinc-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 hover:border-teal-500 transition-all active:scale-95"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
            </div>

          </div>

          {/* Compact Bottom Bar: Copyright, Locale & Legal Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-zinc-400">
            
            {/* Left: Copyright & Locale Indicator */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <p>
                &copy; {new Date().getFullYear()} Renterty Inc. All rights reserved.
              </p>
              <span className="text-slate-700 dark:text-zinc-700 hidden sm:inline">•</span>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/60 dark:bg-zinc-900/60 border border-slate-800 dark:border-zinc-800 text-[11px] text-slate-300 dark:text-zinc-300">
                <Globe className="h-3 w-3 text-teal-400" />
                <span>USD ($)</span>
              </div>
            </div>

            {/* Right: Legal Pipes & Back To Top */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/privacy" className="hover:text-teal-400 dark:hover:text-teal-300 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-slate-700 dark:text-zinc-700">•</span>
              <Link href="/terms" className="hover:text-teal-400 dark:hover:text-teal-300 transition-colors">
                Terms & Conditions
              </Link>
              <span className="text-slate-700 dark:text-zinc-700">•</span>
              <Link href="/contact" className="hover:text-teal-400 dark:hover:text-teal-300 transition-colors">
                Contact Us
              </Link>

              {/* Back to top button */}
              <button
                onClick={scrollToTop}
                type="button"
                aria-label="Scroll back to top"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-zinc-900 hover:bg-teal-500/10 border border-slate-800 dark:border-zinc-800 hover:border-teal-500/30 text-slate-300 hover:text-teal-400 text-xs font-medium transition-all active:scale-95 cursor-pointer ml-1"
              >
                <span>Top</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          SIGNATURE DISPLAY WATERMARK TYPOGRAPHY (PadiSave & Studio inspiration)
         ========================================================================= */}
      <div 
        aria-hidden="true"
        className="w-full flex justify-center items-center overflow-hidden text-center pointer-events-none select-none mt-8 -mb-6 md:-mb-10 opacity-70"
      >
        <span className="text-[14vw] sm:text-[18.4vw] md:text-[18.4vw] ml-[-25] font-extrabold leading-[.75] tracking-tight bg-gradient-to-b from-slate-800/40 via-teal-950/20 to-transparent dark:from-zinc-800/40 dark:via-teal-950/20 dark:to-transparent bg-clip-text text-transparent block text-center">
          RENTERTY
        </span>
      </div>

    </footer>
  );
};

export default Footer;
