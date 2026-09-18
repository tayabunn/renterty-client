"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  CreditCard,
  Bell,
  HelpCircle,
  FileText,
  Printer,
  Search,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  Menu,
  X,
  Share2,
  Check,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("collection");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const sections = [
    {
      id: "collection",
      title: "1. Information We Collect",
      icon: Database,
      summary: "Personal details, account info, rental history, and usage analytics.",
      content: (
        <div className="space-y-4">
          <p>
            At <strong>Renterty</strong>, we collect information you provide directly to us, including when you create an account, complete rental applications, message landlords or tenants, book property tours, or process payments:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li><strong>Account &amp; Profile Details:</strong> Full name, email address, phone number, government-issued photo ID (for tenant/landlord identity verification), and profile photos.</li>
            <li><strong>Property &amp; Lease Data:</strong> Rental property addresses, listing photos, pricing, lease agreements, and maintenance requests.</li>
            <li><strong>Payment Information:</strong> Encrypted payment method tokens processed securely via Stripe. We do not store raw credit card numbers on Renterty servers.</li>
            <li><strong>Automated Data:</strong> Device data, IP addresses, browser types, and approximate location data when using the Interactive Map or AI Rent Estimator.</li>
          </ul>
        </div>
      )
    },
    {
      id: "usage",
      title: "2. How We Use Your Information",
      icon: Eye,
      summary: "Platform operations, matchmaking, security verification, and communication.",
      content: (
        <div className="space-y-4">
          <p>We use the data collected for the following legitimate purposes:</p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li>To match tenants with verified rental properties and facilitate direct communication with landlords.</li>
            <li>To generate legally compliant digital lease agreements and record verifiable e-signatures.</li>
            <li>To process monthly rent payments, escrow deposits, and payout disbursements.</li>
            <li>To power AI services such as neighborhood score computation, rental affordability analysis, and maintenance ticket triage.</li>
            <li>To detect and prevent fraudulent listings, identity theft, and spam.</li>
          </ul>
        </div>
      )
    },
    {
      id: "sharing",
      title: "3. Information Sharing & Disclosure",
      icon: UserCheck,
      summary: "When data is shared between landlords, tenants, and third-party partners.",
      content: (
        <div className="space-y-4">
          <p>We never sell your personal data. We only share information in the following situations:</p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li><strong>Between Tenants and Landlords:</strong> When you book a tour, submit a rental application, or sign a lease, relevant contact and profile details are shared with the counterparty.</li>
            <li><strong>Payment &amp; Verification Providers:</strong> Secure transmission to Stripe for payment processing and identity verification APIs.</li>
            <li><strong>Legal &amp; Safety Compliance:</strong> When required by law, subpoena, or to protect the vital interests and physical safety of platform users.</li>
          </ul>
        </div>
      )
    },
    {
      id: "security",
      title: "4. Data Security & Storage",
      icon: Lock,
      summary: "Encryption, secure cloud databases, and strict access controls.",
      content: (
        <div className="space-y-4">
          <p>
            We implement industry-standard administrative, physical, and technical safeguards to protect your personal information against unauthorized access, destruction, or disclosure.
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li>All network communications are encrypted end-to-end using TLS 1.3 / HTTPS.</li>
            <li>Sensitive records such as lease signatures and identification documents are stored with AES-256 encryption at rest.</li>
            <li>Regular security audits and continuous monitoring for suspicious activity.</li>
          </ul>
        </div>
      )
    },
    {
      id: "rights",
      title: "5. Your Privacy Rights & Choices",
      icon: ShieldCheck,
      summary: "Accessing, updating, exporting, or deleting your personal information.",
      content: (
        <div className="space-y-4">
          <p>Depending on your jurisdiction (including GDPR, CCPA/CPRA), you have the right to:</p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li>Access, review, and request a copy of the personal data we hold about you.</li>
            <li>Request correction of inaccurate or outdated information in your profile.</li>
            <li>Request deletion of your account and associated personal data (subject to statutory financial and lease retention requirements).</li>
            <li>Opt out of non-essential marketing emails and notifications at any time.</li>
          </ul>
        </div>
      )
    },
    {
      id: "contact",
      title: "6. Privacy Inquiries & Officer",
      icon: HelpCircle,
      summary: "How to contact Renterty's Data Protection Officer.",
      content: (
        <div className="space-y-4">
          <p>
            For privacy inquiries or to exercise your statutory data rights, please contact our Data Protection Team:
          </p>
          <div className="p-4 sm:p-5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1.5 text-xs sm:text-sm">
            <p className="font-bold text-slate-800 dark:text-zinc-100">Renterty Inc. — Data Protection Office</p>
            <p>100 Renterty Avenue, Suite 200, San Francisco, CA 94107</p>
            <p>
              Email:{" "}
              <a href="mailto:privacy@renterty.com" className="text-teal-600 dark:text-teal-400 hover:underline font-semibold">
                privacy@renterty.com
              </a>
            </p>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections;

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      
      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }

      const isMobileOrTablet = window.innerWidth < 1024;
      const navOffset = isMobileOrTablet ? 140 : 110;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navOffset) {
            setActiveSection(section.id);
            return;
          }
        }
      }
      if (sections.length > 0) {
        setActiveSection(sections[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Renterty Privacy Policy",
          text: "Review Renterty's data privacy and security policies.",
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-300 antialiased selection:bg-teal-500/20 selection:text-teal-600">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin="0"
        aria-valuemax="100"
      />

      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent dark:from-teal-950/40 dark:via-zinc-950 dark:to-zinc-950 pt-5 sm:pt-7 md:pt-8 lg:pt-32 pb-4 sm:pb-6 lg:pb-14 border-b border-slate-200/80 dark:border-zinc-800">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-gradient-to-r from-teal-500/10 via-emerald-500/15 to-teal-500/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3 lg:mb-4 shadow-2xs"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Data &amp; Privacy Protection</span>
            </motion.div>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5 sm:gap-4 lg:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-2xl"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Privacy Policy
                </h1>
                <p className="mt-1.5 sm:mt-2.5 lg:mt-3 text-xs sm:text-sm lg:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
                  We are committed to protecting your personal data, lease documents, and payment security with transparent policies and bank-grade encryption.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-1.5 sm:gap-3 flex-nowrap shrink-0 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0"
              >
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-2xs whitespace-nowrap shrink-0">
                  <span className="font-semibold text-slate-700 dark:text-zinc-200">Last Updated:</span> September 2026
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-800 transition shadow-2xs cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
                  title="Share or Copy Link"
                >
                  {copied ? <Check className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-emerald-500" /> : <Share2 className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-teal-500" />}
                  <span>{copied ? "Link Copied!" : "Share"}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl transition shadow-2xs cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
                  title="Print Privacy Policy"
                >
                  <Printer className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                  <span>Print</span>
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mobile & Tablet Sticky Navigation Bar (< lg) */}
        <div className="lg:hidden sticky top-16 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 py-2 sm:py-2.5 px-3 sm:px-6 shadow-xs transition-all">
          <div className="flex items-center justify-between gap-2 max-w-6xl mx-auto">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-semibold active:scale-95 transition cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/40 shrink-0"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle section navigation menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4 text-teal-600 dark:text-teal-400" /> : <Menu className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
              <span>Jump to Section ({sections.length})</span>
            </button>

            {/* Current Active Section Interactive Button on Mobile & Tablet */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-zinc-900 hover:bg-slate-200/90 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 text-[11px] sm:text-xs font-semibold active:scale-95 transition cursor-pointer max-w-[200px] sm:max-w-xs truncate shadow-2xs"
              title="Click to choose a section"
              aria-label="Current section, click to change"
            >
              <span className="truncate">{sections.find(s => s.id === activeSection)?.title || "Privacy"}</span>
              <ChevronDown className={`h-3 w-3 shrink-0 text-teal-500 transition-transform duration-200 ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Floating Dropdown Drawer with backdrop */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 top-28 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
                />

                {/* Floating Menu Panel */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 right-0 w-full bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 shadow-2xl z-50 px-3 sm:px-6 py-3 max-h-[60vh] overflow-y-auto"
                >
                  <div className="max-w-6xl mx-auto space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-xs transition cursor-pointer ${
                            isActive
                              ? "bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold border-l-2 border-teal-500"
                              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-200"
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-teal-500" : "text-slate-400"}`} />
                            <span className="truncate">{section.title}</span>
                          </div>
                          <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-teal-500" : "text-slate-400"}`} />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content Layout */}
        <section className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
            
            {/* Desktop Sticky Table of Contents */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search privacy policy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 shadow-2xs transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Sections
                  </h3>
                  <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md">
                    {filteredSections.length} items
                  </span>
                </div>
                <nav className="space-y-1 max-h-[58vh] overflow-y-auto pr-1">
                  {filteredSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-medium transition duration-150 cursor-pointer ${
                          isActive
                            ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold border-l-2 border-teal-500"
                            : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-teal-500" : "text-slate-400"}`} />
                          <span className="truncate">{section.title}</span>
                        </div>
                        <ChevronRight className={`h-3 w-3 shrink-0 transition-transform duration-200 ${isActive ? "rotate-90 text-teal-500" : "text-slate-300 dark:text-zinc-700"}`} />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Support Box */}
              <div className="p-5 rounded-lg bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-teal-500/20 shadow-2xs">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Privacy Questions?</h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      Reach out to our Data Protection Officer for data export or deletion requests.
                    </p>
                    <Link
                      href="mailto:privacy@renterty.com"
                      className="inline-flex items-center space-x-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline mt-3"
                    >
                      <span>Email DPO</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Sections */}
            <div className="lg:col-span-8 space-y-3.5 sm:space-y-5 lg:space-y-8">
              {/* Mobile Search Bar */}
              <div className="lg:hidden relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search privacy policy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs transition"
                />
              </div>

              {filteredSections.length === 0 ? (
                <div className="text-center py-10 sm:py-16 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
                  <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">No matching sections found</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Try searching with a different keyword</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 rounded-lg hover:bg-teal-100 transition"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                filteredSections.map((section, idx) => {
                  const Icon = section.icon;
                  return (
                    <motion.article
                      key={section.id}
                      id={section.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.35, delay: idx * 0.02 }}
                      className="p-4 sm:p-7 md:p-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs transition-all duration-200 hover:border-slate-300 dark:hover:border-zinc-700 scroll-mt-32 sm:scroll-mt-36 lg:scroll-mt-28"
                    >
                      <div className="flex items-start sm:items-center space-x-2.5 sm:space-x-4 mb-3 pb-3 sm:mb-4 sm:pb-4 border-b border-slate-100 dark:border-zinc-800/80">
                        <div className="p-2 sm:p-2.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0 mt-0.5 sm:mt-0">
                          <Icon className="h-4 sm:h-5 w-4 sm:w-5" />
                        </div>
                        <div>
                          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                            {section.title}
                          </h2>
                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
                            {section.summary}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-zinc-300 space-y-2.5 sm:space-y-3">
                        {section.content}
                      </div>
                    </motion.article>
                  );
                })
              )}

              {/* Bottom Terms Banner */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-5 sm:p-7 rounded-lg bg-slate-900 text-white dark:bg-zinc-900/90 dark:border dark:border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm sm:text-base font-bold">Looking for Terms &amp; Conditions?</h4>
                  <p className="text-xs text-slate-400 dark:text-zinc-400 mt-1">
                    Review our platform usage rules, landlord obligations, and payment terms.
                  </p>
                </div>
                <Link
                  href="/terms"
                  className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white transition shrink-0 active:scale-95 shadow-2xs"
                >
                  View Terms &amp; Conditions
                </Link>
              </motion.div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
