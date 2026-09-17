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
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/30 dark:from-zinc-900/90 dark:via-zinc-900/50 dark:to-teal-950/40 p-5 sm:p-7 md:p-8 rounded-3xl border border-slate-800/80 dark:border-teal-500/20 backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 md:gap-8">
            
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold tracking-wide">
                <Sparkles className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
                <span>Next-Gen Rental Intelligence</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Stay updated on rental market drops &amp; smart lease alerts
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-zinc-400 leading-relaxed">
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
                <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-400">
                  <strong className="text-teal-400 font-bold">25,000+</strong>
                  {" "}renters &amp; landlords subscribed
                </span>
              </div>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="w-full lg:w-auto lg:min-w-[380px] shrink-0">
              {subscribed ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold"
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
                      className="w-full pl-4 pr-32 py-3.5 rounded-2xl bg-slate-950/80 dark:bg-zinc-950/90 border border-slate-700/80 dark:border-zinc-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-inner"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md shadow-teal-500/20"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-500 px-1">
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
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 py-4 px-5 rounded-2xl bg-slate-900/40 dark:bg-zinc-900/40 border border-slate-800/60 dark:border-zinc-800/60 text-xs text-slate-400 dark:text-zinc-400">
            
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
