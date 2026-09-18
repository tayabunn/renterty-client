"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Bot,
  Building,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Globe,
  Headphones,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "General Support",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const contactChannels = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Direct email for general questions and tenant assistance.",
      value: "support@renterty.com",
      link: "mailto:support@renterty.com",
      badge: "Avg < 15m reply",
      badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20"
    },
    {
      icon: Phone,
      title: "Direct Phone Line",
      description: "Speak directly with a rental operations specialist.",
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567",
      badge: "24/7 Available",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    },
    {
      icon: Building,
      title: "Landlord Relations",
      description: "Fast-track onboarding and property verification support.",
      value: "landlords@renterty.com",
      link: "mailto:landlords@renterty.com",
      badge: "Verified Landlords",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
    },
    {
      icon: MapPin,
      title: "Global Headquarters",
      description: "Visit our tech and operations center in the Bay Area.",
      value: "100 Renterty Avenue, San Francisco, CA 94105",
      link: "https://maps.google.com/?q=San+Francisco,+CA",
      badge: "Mon - Fri, 9am - 6pm PST",
      badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/20"
    }
  ];

  const faqs = [
    {
      question: "How fast does Renterty customer support respond?",
      answer: "Our global support team operates 24/7. Live chat and emergency tenant/landlord inquiries typically receive a response within 15 minutes. General email requests are answered within 2 to 4 hours."
    },
    {
      question: "How do I report a listing or request landlord verification?",
      answer: "You can submit an inquiry above selecting 'Landlord / Property Listing' or email verification@renterty.com with your property deed or management agreement. Verified badges are usually issued within 24 hours after identity screening."
    },
    {
      question: "Can I get assistance with digital lease agreements and Stripe escrow?",
      answer: "Yes! All digital leases and security deposits processed via Renterty include 256-bit bank encryption and automated compliance checking. Contact our legal & trust team anytime for contract walkthroughs."
    },
    {
      question: "How do I schedule an in-person or live virtual property tour?",
      answer: "Navigate to any property listing on Renterty, click 'Book Tour', and pick an available time slot directly from the verified owner's calendar. You will receive an instant calendar invite with directions or a video link."
    },
    {
      question: "Where are Renterty office locations located?",
      answer: "Our primary global headquarters is located in San Francisco, California, with regional support hubs operating across New York, Austin, London, and Toronto."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      inquiryType: "General Support",
      subject: "",
      message: ""
    });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col selection:bg-teal-500 selection:text-white">
      <Navbar />

      <main className="flex-1 relative overflow-hidden pt-28 sm:pt-32 pb-20">
        {/* Ambient Top Background Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl h-96 bg-gradient-to-b from-teal-500/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-2/3 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-[90%] max-w-7xl mx-auto space-y-16">
          
          {/* =========================================================================
              HERO HEADER
             ========================================================================= */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
              <span>We&apos;re Here to Help 24/7</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Get in touch with the <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Renterty Team</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 dark:text-zinc-400 leading-relaxed">
              Have questions about verified listings, digital leases, landlord onboarding, or AI valuations? Our dedicated PropTech support specialists are ready to assist you anytime.
            </p>
          </div>

          {/* =========================================================================
              4 CHANNELS CARDS
             ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactChannels.map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/60 dark:bg-zinc-900/60 border border-slate-800/80 dark:border-zinc-800/80 rounded-lg p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between gap-5 hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${channel.badgeColor}`}>
                        {channel.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{channel.title}</h3>
                      <p className="text-xs text-slate-400 dark:text-zinc-400 mt-1 leading-relaxed">
                        {channel.description}
                      </p>
                    </div>
                  </div>

                  <a
                    href={channel.link}
                    target={channel.link.startsWith("http") ? "_blank" : undefined}
                    rel={channel.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5 pt-2 border-t border-slate-800/60 dark:border-zinc-800/60 break-all"
                  >
                    <span>{channel.value}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              );
            })}
          </div>

          {/* =========================================================================
              MAIN CONTACT ROW: Interactive Form & Live Support Sidebar
             ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* LEFT: Contact Form (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-900/70 dark:bg-zinc-900/70 border border-slate-800/80 dark:border-zinc-800/80 rounded-lg p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="mb-6 space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
                  <MessageSquare className="h-4 w-4" />
                  <span>Send an Instant Message</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  How can we assist you today?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 dark:text-zinc-400">
                  Fill in the details below and our operations desk will route your message to the appropriate department.
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4"
                >
                  <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Message Received!</h3>
                    <p className="text-xs sm:text-sm text-slate-300 dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-emerald-400">{formData.name}</strong>. Your ticket has been logged and our support team is reviewing your message.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleReset}
                      type="button"
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer active:scale-95"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-xs font-semibold text-slate-300">
                        Full Name <span className="text-teal-400">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 dark:bg-zinc-950/80 border border-slate-800 dark:border-zinc-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-semibold text-slate-300">
                        Email Address <span className="text-teal-400">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sarah@example.com"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 dark:bg-zinc-950/80 border border-slate-800 dark:border-zinc-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-phone" className="text-xs font-semibold text-slate-300">
                        Phone Number (Optional)
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 dark:bg-zinc-950/80 border border-slate-800 dark:border-zinc-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-inquiry" className="text-xs font-semibold text-slate-300">
                        Inquiry Topic <span className="text-teal-400">*</span>
                      </label>
                      <select
                        id="contact-inquiry"
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 dark:bg-zinc-950/80 border border-slate-800 dark:border-zinc-800 text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                      >
                        <option value="General Support">General Support & Inquiries</option>
                        <option value="Tenant Assistance">Tenant Tour & Booking Help</option>
                        <option value="Landlord Verification">Landlord Onboarding & Verification</option>
                        <option value="AI Estimator">AI Price Estimator Feedback</option>
                        <option value="Partnership & Press">Partnership & Media</option>
                        <option value="Legal & Compliance">Legal & Trust Inquiries</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-300">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief summary of your question..."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 dark:bg-zinc-950/80 border border-slate-800 dark:border-zinc-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-semibold text-slate-300">
                      Message <span className="text-teal-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide details about your question, listing URL, or booking request..."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 dark:bg-zinc-950/80 border border-slate-800 dark:border-zinc-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-slate-500 dark:text-zinc-500 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                      Protected by 256-bit SSL encryption. Zero spam policy.
                    </p>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg shadow-teal-500/20 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <span>Submit Message</span>
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT: Live AI Concierge & Quick Access (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card 1: 24/7 AI Concierge Box */}
              <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/40 border border-slate-800/80 dark:border-teal-500/20 rounded-lg p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
                    <Bot className="h-3.5 w-3.5" />
                    <span>Real-time AI Concierge</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Online</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Instant Answers with Renterty AI
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-400 mt-1 leading-relaxed">
                    Need fast rent valuation guidance, neighborhood comparisons, or lease terms clarity? Our AI Concierge is available instantly without waiting.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href="/estimator"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-teal-500/10 border border-slate-800 hover:border-teal-500/30 text-slate-300 hover:text-teal-400 text-xs font-semibold transition-all active:scale-95"
                  >
                    <span>AI Rent Estimator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all active:scale-95"
                  >
                    <span>How It Works</span>
                  </Link>
                </div>
              </div>

              {/* Card 2: Operations Support & Hours */}
              <div className="bg-slate-900/60 dark:bg-zinc-900/60 border border-slate-800/80 dark:border-zinc-800/80 rounded-lg p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white">
                  <Clock className="h-4 w-4 text-teal-400" />
                  <span>Support Availability</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 dark:bg-zinc-950/60 border border-slate-800/60">
                    <span className="text-slate-400">Live Chat & AI Desk</span>
                    <span className="font-bold text-emerald-400">24/7 / 365 Days</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 dark:bg-zinc-950/60 border border-slate-800/60">
                    <span className="text-slate-400">Telephone Hotline</span>
                    <span className="font-semibold text-slate-200">Mon - Sun (8am - 10pm EST)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 dark:bg-zinc-950/60 border border-slate-800/60">
                    <span className="text-slate-400">Landlord Verification Desk</span>
                    <span className="font-semibold text-slate-200">Mon - Fri (9am - 6pm PST)</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Security & Escrow Guarantee */}
              <div className="bg-slate-900/40 dark:bg-zinc-900/40 border border-slate-800/60 rounded-lg p-5 flex items-center gap-3.5 text-xs text-slate-400">
                <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs sm:text-sm">Verified Escrow &amp; Dispute Protection</p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5">
                    Security deposits are held in insured digital escrow accounts until lease commencement.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* =========================================================================
              ACCORDION FAQS SECTION
             ========================================================================= */}
          <div className="pt-8 border-t border-slate-800/80 dark:border-zinc-800/80 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
                <HelpCircle className="h-4 w-4" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Quick Answers to Common Inquiries
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-zinc-400">
                Find immediate answers regarding platform policies, verified landlords, and payment processes.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-900/60 dark:bg-zinc-900/60 border border-slate-800/80 dark:border-zinc-800/80 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      type="button"
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-white hover:text-teal-400 transition-colors gap-4 cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-teal-400" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-5 sm:px-6 pb-5 text-xs sm:text-sm text-slate-400 dark:text-zinc-400 leading-relaxed border-t border-slate-800/40"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
