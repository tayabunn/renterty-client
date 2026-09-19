"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sliders, DollarSign, Megaphone, Download, ShieldCheck,
  Save, Check, AlertCircle, FileSpreadsheet, Lock, BellRing, Sparkles, ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  // Commission settings
  const [commissionRate, setCommissionRate] = useState(10);
  const [escrowDays, setEscrowDays] = useState(14);
  const [instantBookingFee, setInstantBookingFee] = useState(25);

  // Broadcast settings
  const [bannerActive, setBannerActive] = useState(false);
  const [bannerText, setBannerText] = useState("🌟 Spring Promotion: 0% service fees on your first rental reservation!");
  const [bannerAudience, setBannerAudience] = useState("all");

  const [saving, setSaving] = useState(false);

  const handleSaveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Platform settings successfully updated!");
    }, 600);
  };

  // CSV Exporter
  const exportCsv = (type) => {
    let filename = `renterty_${type}_${new Date().toISOString().split("T")[0]}.csv`;
    let csvContent = "data:text/csv;charset=utf-8,";

    if (type === "bookings") {
      csvContent += "ID,Property Name,Tenant Name,Tenant Email,Amount,Move In Date,Status,Payment\n";
      csvContent += "BK-1001,Modern Studio Manhattan,Jane Doe,jane@example.com,2400,2026-10-01,Confirmed,Paid\n";
      csvContent += "BK-1002,Miami Coastal Villa,Alex Morgan,alex@example.com,4800,2026-10-15,Pending,Paid\n";
      csvContent += "BK-1003,Aspen Luxury Log Cabin,Clara Vance,clara@example.com,1800,2026-11-01,Confirmed,Paid\n";
    } else if (type === "financials") {
      csvContent += "Transaction ID,Date,Amount,Platform Commission (10%),Payer Email,Stripe Status\n";
      csvContent += "tx_9921_stripe,2026-09-12,$2400,$240,jane@example.com,Succeeded\n";
      csvContent += "tx_9922_stripe,2026-09-13,$4800,$480,alex@example.com,Succeeded\n";
      csvContent += "tx_9923_stripe,2026-09-14,$1800,$180,clara@example.com,Succeeded\n";
    } else {
      csvContent += "User ID,Full Name,Email,Role,Verification Status,Joined Date\n";
      csvContent += "USR-01,Admin User,admin@renterty.com,Admin,Verified,2026-01-01\n";
      csvContent += "USR-02,Sophia Martinez,sophia@example.com,Owner,Verified,2026-02-14\n";
      csvContent += "USR-03,Liam Henderson,liam@example.com,Tenant,Verified,2026-03-20\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filename}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Sliders className="h-3.5 w-3.5" />
              <span>CONFIGURATION & MONETIZATION</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Control platform monetization rates, broadcast system announcements, and export audited ledger records.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50 self-end sm:self-auto"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monetization & Take-Rate */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 space-y-6"
        >
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-teal-500" />
              <span>Monetization & Commission Control</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Configure platform service fees deducted on completed booking reservations.
            </p>
          </div>

          <div className="space-y-5">
            {/* Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                  Platform Commission Rate
                </label>
                <span className="text-sm px-2.5 py-0.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold">
                  {commissionRate}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>1% (Competitive)</span>
                <span>10% (Standard)</span>
                <span>25% (Premium)</span>
              </div>
            </div>

            {/* Escrow Threshold */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                Automated Escrow Payout Threshold ($)
              </label>
              <input
                type="number"
                value={escrowThreshold}
                onChange={(e) => setEscrowThreshold(e.target.value)}
                className="w-full border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Maintenance Auto-Approve Limit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                Maintenance AI Auto-Authorize Limit ($)
              </label>
              <input
                type="number"
                value={maintenanceLimit}
                onChange={(e) => setMaintenanceLimit(e.target.value)}
                className="w-full border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-teal-500"
              />
              <span className="text-[11px] text-slate-400">
                Repair costs below this threshold dispatch certified contractors immediately.
              </span>
            </div>
          </div>
        </motion.div>

        {/* Global Platform Banner & Communication */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 sm:p-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 space-y-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Megaphone className="h-5 w-5 text-teal-500" />
                <span>Broadcast Announcement</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Display a persistent notification banner at the top of the application.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={bannerActive}
                onChange={(e) => setBannerActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
            </label>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                Banner Message Content
              </label>
              <textarea
                rows={2}
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Enter alert message..."
                className="w-full border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                Target Audience
              </label>
              <div className="relative">
                <select
                  value={bannerAudience}
                  onChange={(e) => setBannerAudience(e.target.value)}
                  className="w-full appearance-none border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 pl-3.5 pr-10 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="all">All Visitors & Users</option>
                  <option value="owners">Property Owners Only</option>
                  <option value="tenants">Tenants & Renters Only</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Live Preview
              </span>
              <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                bannerActive
                  ? "bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300"
                  : "bg-slate-100 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-800 text-slate-400"
              }`}>
                <BellRing className="h-4 w-4 shrink-0" />
                <span className="truncate">{bannerText || "No message entered"}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 1-Click CSV Data Export Center */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 sm:p-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 space-y-6"
      >
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5 text-teal-500" />
            <span>Audited Data Exports</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Export structured CSV data for financial accounting, quarterly tax filing, and investor reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-3">
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              Reservations & Bookings
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Includes tenant IDs, property titles, move-in dates, and payment status.
            </p>
            <button
              onClick={() => exportCsv("bookings")}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-900 dark:bg-zinc-800 hover:bg-teal-500 dark:hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Bookings (.csv)</span>
            </button>
          </div>

          <div className="p-5 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-3">
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              Ledger & Stripe Financials
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Itemized transaction logs with platform take-rate breakdown.
            </p>
            <button
              onClick={() => exportCsv("financials")}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-900 dark:bg-zinc-800 hover:bg-teal-500 dark:hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Financials (.csv)</span>
            </button>
          </div>

          <div className="p-5 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-3">
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              User & Landlord Roster
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Complete account roster with verification status and creation dates.
            </p>
            <button
              onClick={() => exportCsv("users")}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-900 dark:bg-zinc-800 hover:bg-teal-500 dark:hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Users (.csv)</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
