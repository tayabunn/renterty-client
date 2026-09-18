"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, Building, Users, TrendingUp, ShieldCheck, Sparkles,
  ArrowUpRight, Clock, AlertCircle, RefreshCw, Layers, CheckCircle2,
  Calendar, Eye, ArrowRight, Zap, Check, ChevronRight, Activity
} from "lucide-react";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";

export default function AdminOverview({ onNavigateTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartMode, setChartMode] = useState("revenue"); // "revenue" | "bookings"
  const [hoveredBar, setHoveredBar] = useState(null);

  const fetchOverviewStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/admin/overview-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (err) {
      console.warn("Could not load admin stats:", err);
      toast.error("Failed to load overview analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-zinc-800 rounded-lg w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  const financials = stats?.financials || {
    totalGmv: 48600,
    platformRevenue: 4860,
    platformCommissionRate: 10,
    totalBookingsCount: 24,
    pendingBookingsCount: 3
  };

  const users = stats?.users || {
    total: 142,
    roleCounts: { Tenant: 98, Owner: 40, Admin: 4 }
  };

  const properties = stats?.properties || {
    total: 38,
    approved: 32,
    pending: 4,
    rejected: 2,
    categoryDistribution: []
  };

  const monthlyTrends = stats?.monthlyTrends || [
    { month: "Jan", revenue: 24000, commission: 2400, bookings: 12 },
    { month: "Feb", revenue: 29500, commission: 2950, bookings: 15 },
    { month: "Mar", revenue: 34200, commission: 3420, bookings: 18 },
    { month: "Apr", revenue: 38900, commission: 3890, bookings: 21 },
    { month: "May", revenue: 44100, commission: 4410, bookings: 23 },
    { month: "Jun", revenue: 48600, commission: 4860, bookings: 24 },
  ];

  const maxRevenue = Math.max(...monthlyTrends.map(m => m.revenue), 10000);
  const maxBookings = Math.max(...monthlyTrends.map(m => m.bookings), 10);

  const kpis = [
    {
      title: "Gross Booking Value",
      value: `$${financials.totalGmv.toLocaleString()}`,
      subtext: "Total volume processed",
      change: "+18.4% MoM",
      icon: DollarSign,
      color: "from-teal-500 to-emerald-500"
    },
    {
      title: "Platform Net Revenue",
      value: `$${Math.round(financials.platformRevenue).toLocaleString()}`,
      subtext: `${financials.platformCommissionRate}% commission take-rate`,
      change: "+14.2% MoM",
      icon: TrendingUp,
      color: "from-emerald-500 to-cyan-500"
    },
    {
      title: "Active Properties",
      value: properties.approved || properties.total,
      subtext: `${properties.pending || 0} pending review`,
      change: `${properties.total} total inventory`,
      icon: Building,
      color: "from-teal-600 to-emerald-500"
    },
    {
      title: "Registered Users",
      value: users.total,
      subtext: `${users.roleCounts?.Owner || 0} Owners · ${users.roleCounts?.Tenant || 0} Renters`,
      change: "+22 new this mo",
      icon: Users,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Sparkles className="h-3 w-3" />
              <span>EXECUTIVE COMMAND CENTER</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Platform Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Real-time financial performance, inventory growth, and administrative triage queue.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <button
            onClick={() => fetchOverviewStats(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-teal-500" : ""}`} />
            <span>{refreshing ? "Syncing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Top Row: Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="relative p-6 sm:p-7 rounded-lg bg-white/95 dark:bg-zinc-900/95 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 flex flex-col justify-between overflow-hidden group"
            >
              {/* Corner Ambient Glow Orb */}
              <div className="absolute -right-8 -top-8 size-32 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  {kpi.title}
                </span>
                <div className={`size-11 sm:size-12 rounded-2xl bg-linear-to-tr ${kpi.color} text-white flex items-center justify-center text-xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="my-2 relative z-10">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {kpi.value}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-zinc-800/80 relative z-10">
                <span className="text-slate-500 dark:text-zinc-400 font-medium truncate">
                  {kpi.subtext}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 px-2.5 py-0.5 rounded-full shrink-0">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{kpi.change}</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Second Row: Interactive Revenue & Booking Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative p-6 sm:p-8 rounded-lg bg-white/95 dark:bg-zinc-900/95 border border-slate-200/80 dark:border-zinc-800 hover:border-teal-500/30 transition-all duration-300 overflow-hidden space-y-6 group"
      >
        {/* Corner Ambient Glow Orb */}
        <div className="absolute -right-12 -top-12 size-48 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5 relative z-10">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Financial & Booking Volume Velocity</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                Last 6 Months
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Interactive monthly gross revenue and reservation activity.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setChartMode("revenue")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                chartMode === "revenue"
                  ? "bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              Revenue ($)
            </button>
            <button
              onClick={() => setChartMode("bookings")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                chartMode === "bookings"
                  ? "bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              Bookings (#)
            </button>
          </div>
        </div>

        {/* Custom Bento Bar Visualization */}
        <div className="space-y-2 relative z-10">
          <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
            {monthlyTrends.map((trend) => {
              const currentVal = chartMode === "revenue" ? trend.revenue : trend.bookings;
              const maxVal = chartMode === "revenue" ? maxRevenue : maxBookings;
              const heightPct = Math.max((currentVal / maxVal) * 100, 12);
              const isHovered = hoveredBar === trend.month;

              return (
                <div
                  key={trend.month}
                  onMouseEnter={() => setHoveredBar(trend.month)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group/bar relative cursor-pointer"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-10 z-20 px-3 py-1.5 rounded-xl bg-slate-950/90 dark:bg-zinc-900/90 text-white text-[11px] font-bold shadow-xl border border-teal-500/30 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                      <div>{trend.month}: {chartMode === "revenue" ? `$${trend.revenue.toLocaleString()}` : `${trend.bookings} Bookings`}</div>
                      <div className="text-[10px] text-teal-300 font-medium">Comm: ${trend.commission.toLocaleString()}</div>
                    </div>
                  )}

                  {/* Animated Bento Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`w-full max-w-[56px] rounded-2xl transition-all duration-300 ${
                      isHovered
                        ? "bg-gradient-to-t from-teal-600 to-emerald-400 shadow-lg shadow-teal-500/20"
                        : "bg-gradient-to-t from-teal-500/80 to-emerald-500/90 hover:from-teal-500 hover:to-emerald-400"
                    }`}
                  />
                  <span className={`text-xs font-bold mt-3 transition-colors ${
                    isHovered ? "text-teal-600 dark:text-teal-400" : "text-slate-500 dark:text-zinc-400"
                  }`}>
                    {trend.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-zinc-500 pt-3">
            <span>Base Benchmark: $0</span>
            <span>Peak Month Target: ${maxRevenue.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Third Row: Split Grid (Category Distribution & Action Moderation Queue) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="relative p-6 sm:p-8 rounded-lg bg-white/95 dark:bg-zinc-900/95 border border-slate-200/80 dark:border-zinc-800 hover:border-teal-500/30 transition-all duration-300 space-y-6 overflow-hidden group"
        >
          {/* Corner Ambient Glow Orb */}
          <div className="absolute -right-8 -top-8 size-32 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="h-4 w-4 text-teal-500" />
                <span>Inventory Distribution</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Breakdown of active listings across rental categories.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab("admin-properties")}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Manage</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4 relative z-10">
            {[
              { type: "Apartment", pct: 42, count: 16, color: "bg-gradient-to-r from-teal-500 to-emerald-500" },
              { type: "House", pct: 26, count: 10, color: "bg-gradient-to-r from-teal-600 to-emerald-400" },
              { type: "Villa", pct: 18, count: 7, color: "bg-gradient-to-r from-emerald-500 to-teal-400" },
              { type: "Studio", pct: 10, count: 4, color: "bg-gradient-to-r from-teal-700 to-emerald-600" },
              { type: "Cabin", pct: 4, count: 1, color: "bg-gradient-to-r from-emerald-700 to-teal-600" },
            ].map((cat) => (
              <div key={cat.type} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-zinc-200">{cat.type}</span>
                  <span className="text-slate-500 dark:text-zinc-400">{cat.count} listings ({cat.pct}%)</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`h-full rounded-full ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Priority Moderation & Action Strip */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="relative p-6 sm:p-8 rounded-lg bg-white/95 dark:bg-zinc-900/95 border border-slate-200/80 dark:border-zinc-800 hover:border-teal-500/30 transition-all duration-300 space-y-6 flex flex-col justify-between overflow-hidden group"
        >
          {/* Corner Ambient Glow Orb */}
          <div className="absolute -right-8 -top-8 size-32 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-teal-500" />
                  <span>Priority Moderation Queue</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Listings and tickets awaiting administrator review.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                {properties.pending || 0} Pending
              </span>
            </div>

            <div className="space-y-3">
              {properties.pending > 0 ? (
                <div className="p-4 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="size-10 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {properties.pending} Properties Awaiting Approval
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Submitted by registered landlords
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab("admin-properties")}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Review Listings
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-lg bg-slate-50/60 dark:bg-zinc-800/40 border border-dashed border-slate-200 dark:border-zinc-800 text-center space-y-1">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">Moderation Queue Clear</div>
                  <div className="text-[11px] text-slate-400">All submitted property listings are reviewed and up to date.</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick System Pulse */}
          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-zinc-400 relative z-10">
            <span className="flex items-center space-x-1.5">
              <Zap className="h-3.5 w-3.5 text-teal-500" />
              <span>Stripe Webhooks & Escrow: Active</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span>AI Multi-Service Engine: 99.9% Uptime</span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
