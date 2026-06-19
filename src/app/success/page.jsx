"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CheckCircle2, Calendar, ClipboardCheck, ArrowRight, Home, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const tx = searchParams.get("tx") || "N/A";
  const amount = searchParams.get("amount") || "0";
  const title = searchParams.get("title") || "Property listing";

  return (
    <div className="max-w-md mx-auto py-16 px-4 sm:px-6 text-center">
      {/* Animated Success Badge */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="flex justify-center mb-6"
      >
        <div className="p-4 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-500 rounded-full shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-16 w-16" />
        </div>
      </motion.div>

      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Booking Confirmed!
      </h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">
        Your reservation fee has been processed securely via Stripe. The owner has been notified to review your move-in request.
      </p>

      {/* Invoice Details Box */}
      <div className="mt-8 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 text-left space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800 pb-2">
          TRANSACTION RECEIPT
        </h3>
        <div>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">PROPERTY BOOKED</span>
          <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">{title}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">AMOUNT CHARGED</span>
            <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">${Number(amount).toLocaleString()} USD</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">PAYMENT METHOD</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Stripe Card</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">TRANSACTION ID</span>
          <span className="text-xs font-mono text-slate-600 dark:text-zinc-400 break-all select-all">{tx}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition duration-200 text-sm"
        >
          <ClipboardCheck className="h-4 w-4" />
          <span>Go to My Bookings</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="w-full flex items-center justify-center space-x-2 py-3 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-xl font-bold transition text-sm text-slate-700 dark:text-zinc-300"
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}

export default function Success() {
  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col justify-center items-center py-10 bg-slate-50 dark:bg-zinc-950 transition-colors">
        <Suspense fallback={
          <div className="text-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-teal-500 mx-auto mb-4" />
            <span className="text-sm font-semibold text-slate-500">Retrieving details...</span>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
