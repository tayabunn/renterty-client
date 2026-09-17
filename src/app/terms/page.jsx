"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FileText,
  ShieldCheck,
  Scale,
  CreditCard,
  Building,
  UserCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Printer,
  Search,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
  Menu,
  X,
  Share2,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: CheckCircle2,
      summary: "Agreement to be bound by these legal terms when accessing Renterty.",
      content: (
        <div className="space-y-4">
          <p>
            Welcome to <strong>Renterty</strong> (&ldquo;Renterty&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing, browsing, registering for, or using our website, mobile interfaces, AI tools, or any related services (collectively, the &ldquo;Platform&rdquo;), you agree to comply with and be bound by these Terms and Conditions (&ldquo;Terms&rdquo;).
          </p>
          <p>
            If you do not agree to these Terms, you must not access or use the Platform. These Terms constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;Tenant&rdquo;, or &ldquo;Landlord/Property Owner&rdquo;) and Renterty Inc.
          </p>
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-500/20 text-teal-900 dark:text-teal-200 text-xs sm:text-sm">
            <strong className="font-bold">Key Summary:</strong> Using Renterty means you agree to these legal obligations, including our dispute resolution procedures and privacy standards.
          </div>
        </div>
      )
    },
    {
      id: "eligibility",
      title: "2. Eligibility & Account Security",
      icon: UserCheck,
      summary: "Age limits, identity verification, and maintaining account credentials.",
      content: (
        <div className="space-y-4">
          <p>
            To register an account on Renterty or enter into legally binding rental contracts:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li>You must be at least 18 years of age or the age of legal majority in your jurisdiction.</li>
            <li>You must provide accurate, current, and complete registration information during sign-up.</li>
            <li>You are responsible for safeguarding your password and account credentials. You must notify Renterty immediately of any unauthorized account activity.</li>
            <li>Renterty reserves the right to suspend or terminate accounts that contain false, misleading, or fraudulent information.</li>
          </ul>
        </div>
      )
    },
    {
      id: "marketplace-role",
      title: "3. Nature of the Platform",
      icon: Building,
      summary: "Renterty's role as a technology platform connecting Tenants and Landlords.",
      content: (
        <div className="space-y-4">
          <p>
            Renterty operates an online marketplace and software ecosystem designed to facilitate connections, property discovery, virtual/in-person tour scheduling, digital lease execution, automated rent processing, and AI-driven maintenance coordination between Tenants and independent Landlords.
          </p>
          <p>Unless explicitly stated in writing:</p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li>Renterty is not a real estate broker, landlord, insurer, or property manager for any third-party listed properties.</li>
            <li>Rental agreements, lease commitments, and property conditions are strictly contracted directly between the Tenant and the Landlord.</li>
            <li>Renterty provides the digital infrastructure to streamline communication, documentation, and payment processing.</li>
          </ul>
        </div>
      )
    },
    {
      id: "landlords",
      title: "4. Landlord & Property Owner Obligations",
      icon: Building,
      summary: "Listing accuracy, fair housing compliance, and maintenance duties.",
      content: (
        <div className="space-y-4">
          <p>
            When listing a property or managing rentals on Renterty, Landlords represent and warrant that:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li>They own the property or have full authorized legal rights to lease the property.</li>
            <li>All listing information, images, pricing, availability dates, and amenities are accurate, truthful, and up-to-date.</li>
            <li>They strictly comply with all applicable local, national, and international Fair Housing and anti-discrimination laws.</li>
            <li>Properties meet all relevant residential safety, building codes, and habitability standards.</li>
            <li>They will promptly respond to maintenance tickets and honor valid digital lease contracts entered through the Platform.</li>
          </ul>
        </div>
      )
    },
    {
      id: "tenants",
      title: "5. Tenant Obligations & Conduct",
      icon: ShieldCheck,
      summary: "Accurate rental applications, timely payments, and respectful property use.",
      content: (
        <div className="space-y-4">
          <p>As a Tenant using Renterty, you agree that:</p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li>All employment, income, credit, and personal details submitted in rental applications are genuine and verifiable.</li>
            <li>You will pay monthly rent, security deposits, and utilities according to the terms of your executed lease agreement.</li>
            <li>You will respect the property and comply with building rules, neighborhood ordinances, and agreed-upon noise regulations.</li>
            <li>You will submit legitimate maintenance requests through the platform and permit reasonable access for repairs.</li>
          </ul>
        </div>
      )
    },
    {
      id: "payments",
      title: "6. Payments, Security Deposits & Fees",
      icon: CreditCard,
      summary: "Stripe processing, escrow handling, platform fees, and refund criteria.",
      content: (
        <div className="space-y-4">
          <p>
            Financial transactions across Renterty are processed securely using trusted payment processors such as Stripe.
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li><strong>Rent Payments:</strong> Rent payments made through the platform are logged automatically with downloadable digital receipts.</li>
            <li><strong>Security Deposits:</strong> Security deposit handling and deductions are governed by the underlying residential lease agreement and applicable local statutory laws.</li>
            <li><strong>Service Fees:</strong> Renterty may apply small, transparent technology platform fees for payment processing and AI verification services, clearly itemized prior to confirmation.</li>
            <li><strong>Cancellations &amp; Refunds:</strong> Refund eligibility for booking holds or deposits is governed by the specific property cancellation policy agreed upon prior to lease finalization.</li>
          </ul>
        </div>
      )
    },
    {
      id: "e-signatures",
      title: "7. E-Signatures & Digital Leases",
      icon: FileText,
      summary: "Legality and enforceability of digital signatures and agreements.",
      content: (
        <div className="space-y-4">
          <p>
            Renterty utilizes compliant electronic signature technology. By clicking &ldquo;Sign Lease&rdquo;, typing your name, or drawing a digital signature on our platform:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li>You acknowledge and agree that your electronic signature carries the same legal weight and enforceability as a handwritten signature under the Electronic Signatures in Global and National Commerce Act (ESIGN) and Uniform Electronic Transactions Act (UETA).</li>
            <li>Both parties will receive a timestamped, tamper-evident PDF record of the executed agreement.</li>
          </ul>
        </div>
      )
    },
    {
      id: "ai-services",
      title: "8. AI Services & Tools",
      icon: Sparkles,
      summary: "Terms governing AI Rent Estimator, Smart Search, and AI Maintenance Dispatch.",
      content: (
        <div className="space-y-4">
          <p>
            Renterty incorporates AI models to offer features including the AI Rent Estimator, neighborhood scoring, and automated maintenance ticket classification.
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li>AI estimates and affordability scores are provided for informational and analytical purposes only. They do not constitute formal real estate appraisals or certified financial advice.</li>
            <li>Maintenance severity levels generated by AI are recommendations; emergency situations should always be escalated to local emergency services when appropriate.</li>
          </ul>
        </div>
      )
    },
    {
      id: "prohibited-activities",
      title: "9. Prohibited Conduct",
      icon: AlertCircle,
      summary: "Restrictions on fraudulent listings, harassment, data scraping, and platform abuse.",
      content: (
        <div className="space-y-4">
          <p>Users agree NOT to engage in any of the following activities on Renterty:</p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            <li>Posting fraudulent, fictitious, duplicate, or deceptive rental listings.</li>
            <li>Attempting to circumvent platform fees or bypass secure transaction channels for verified listings.</li>
            <li>Scraping, crawling, or extracting platform data, property images, or contact details without written consent.</li>
            <li>Harassing, discriminating against, stalking, or sending spam messages to other users.</li>
            <li>Attempting to reverse engineer or breach Renterty&apos;s security systems and server APIs.</li>
          </ul>
        </div>
      )
    },
    {
      id: "liability-disclaimer",
      title: "10. Limitation of Liability & Warranty",
      icon: Scale,
      summary: "Disclaimers regarding property conditions, third-party conduct, and damages.",
      content: (
        <div className="space-y-4">
          <p>
            To the maximum extent permitted by applicable law, Renterty provides the platform on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether express, implied, or statutory.
          </p>
          <p>
            Renterty is not liable for indirect, incidental, punitive, or consequential damages resulting from disputes between landlords and tenants, property defects, personal injuries on rental premises, or unauthorized access to user data beyond reasonable security protocols.
          </p>
        </div>
      )
    },
    {
      id: "governing-law",
      title: "11. Governing Law & Dispute Resolution",
      icon: Scale,
      summary: "Jurisdiction, arbitration, and resolution of legal disputes.",
      content: (
        <div className="space-y-4">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.
          </p>
          <p>
            Any dispute, claim, or controversy arising out of or relating to these Terms or the breach, termination, enforcement, interpretation, or validity thereof shall be resolved through good-faith negotiation, followed by binding individual arbitration if unresolved.
          </p>
        </div>
      )
    },
    {
      id: "contact",
      title: "12. Contact & Legal Inquiries",
      icon: HelpCircle,
      summary: "How to reach Renterty&apos;s legal and compliance team.",
      content: (
        <div className="space-y-4">
          <p>
            If you have questions, feedback, or legal inquiries regarding these Terms &amp; Conditions, please reach out to our legal department:
          </p>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1.5 text-xs sm:text-sm">
            <p className="font-bold text-slate-800 dark:text-zinc-100">Renterty Inc. — Legal &amp; Compliance Department</p>
            <p>100 Renterty Avenue, Suite 200, San Francisco, CA 94107</p>
            <p>
              Email:{" "}
              <a href="mailto:legal@renterty.com" className="text-teal-600 dark:text-teal-400 hover:underline font-semibold">
                legal@renterty.com
              </a>
            </p>
            <p>Phone: +1 (555) 123-4567</p>
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

      // Robust scrollspy: find the topmost visible section using getBoundingClientRect
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
          title: "Renterty Terms & Conditions",
          text: "Review Renterty's official platform terms and conditions.",
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
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-gradient-to-r from-teal-500/10 via-emerald-500/15 to-teal-500/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3 lg:mb-4 shadow-2xs"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Legal Documentation</span>
            </motion.div>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5 sm:gap-4 lg:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-2xl"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Terms &amp; Conditions
                </h1>
                <p className="mt-1.5 sm:mt-2.5 lg:mt-3 text-xs sm:text-sm lg:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Please review these terms carefully. They outline your legal rights, platform policies, payment guarantees, and obligations when using Renterty.
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
                  title="Print Terms"
                >
                  <Printer className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                  <span>Print</span>
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mobile & Tablet Sticky Quick Navigation Bar (Visible on screens < lg) */}
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
              <span className="truncate">{sections.find(s => s.id === activeSection)?.title || "Terms"}</span>
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
            
            {/* Desktop Sticky Table of Contents Sidebar */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
              {/* Quick Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search in terms..."
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

              {/* Navigation Index Card */}
              <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Table of Contents
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
                        className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-xs font-medium transition duration-150 cursor-pointer ${
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

              {/* Quick Legal Support Box */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-teal-500/20 shadow-2xs">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Need Legal Help?</h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      Have questions about your rental lease, security deposits, or platform compliance?
                    </p>
                    <Link
                      href="mailto:support@renterty.com"
                      className="inline-flex items-center space-x-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline mt-3"
                    >
                      <span>Contact Support</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Sections Content */}
            <div className="lg:col-span-8 space-y-3.5 sm:space-y-5 lg:space-y-8">
              {/* Mobile Search Bar */}
              <div className="lg:hidden relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search in terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs transition"
                />
              </div>

              {filteredSections.length === 0 ? (
                <div className="text-center py-10 sm:py-16 bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-zinc-800">
                  <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">No matching sections found</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Try searching with a different keyword</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 rounded-xl hover:bg-teal-100 transition"
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
                      className="p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs transition-all duration-200 hover:border-slate-300 dark:hover:border-zinc-700 scroll-mt-32 sm:scroll-mt-36 lg:scroll-mt-28"
                    >
                      <div className="flex items-start sm:items-center space-x-2.5 sm:space-x-4 mb-3 pb-3 sm:mb-4 sm:pb-4 border-b border-slate-100 dark:border-zinc-800/80">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0 mt-0.5 sm:mt-0">
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

              {/* Bottom Acceptance Banner */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-5 sm:p-7 rounded-3xl bg-slate-900 text-white dark:bg-zinc-900/90 dark:border dark:border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm sm:text-base font-bold">Looking for our Privacy Policy?</h4>
                  <p className="text-xs text-slate-400 dark:text-zinc-400 mt-1">
                    Learn how we collect, protect, and handle your data and payment privacy.
                  </p>
                </div>
                <Link
                  href="/privacy"
                  className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white transition shrink-0 active:scale-95 shadow-2xs"
                >
                  View Privacy Policy
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
