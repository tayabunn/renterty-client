"use client";

import React, { useState, useEffect } from "react";
import { Loader2, DollarSign, Building, Calendar, FileText, TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import ReviewInsights from "../ai/ReviewInsights";
import { API_URL } from "@/lib/config";

export default function OwnerAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chartReady, setChartReady] = useState(false);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalProperties: 0,
    totalBookings: 0,
    chartData: []
  });

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setChartReady(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem("renterty_token");
    try {
      // Fetch bookings to calculate earnings & confirmed bookings
      const bookingsRes = await fetch(`${API_URL}/bookings/owner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Fetch properties to calculate total properties
      const propsRes = await fetch(`${API_URL}/properties/owner`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (bookingsRes.ok && propsRes.ok) {
        const bookings = await bookingsRes.json();
        const properties = await propsRes.json();

        // Calculate metrics
        const totalEarnings = bookings.reduce((sum, b) => sum + b.amount, 0);
        const totalProperties = properties.length;
        const totalBookings = bookings.filter((b) => b.bookingStatus === "Approved").length;

        // Generate Recharts line chart data for last 12 months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyMap = {};

        // Pre-fill last 12 months with 0
        const currentMonthIndex = new Date().getMonth();
        for (let i = 11; i >= 0; i--) {
          const m = (currentMonthIndex - i + 12) % 12;
          const monthName = months[m];
          monthlyMap[monthName] = 0;
        }

        // Sum booking amounts per month
        bookings.forEach((b) => {
          const bDate = new Date(b.createdAt);
          const bMonth = months[bDate.getMonth()];
          if (monthlyMap[bMonth] !== undefined) {
            monthlyMap[bMonth] += b.amount;
          }
        });

        // Convert map to array for Recharts
        const chartData = Object.keys(monthlyMap).map((m) => ({
          month: m,
          Earnings: monthlyMap[m]
        }));

        setStats({
          totalEarnings,
          totalProperties,
          totalBookings,
          chartData
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleDownloadPDF = async () => {
    const token = localStorage.getItem("renterty_token");
    toast.loading("Generating PDF Report...", { id: "pdf-toast" });
    try {
      const res = await fetch(`${API_URL}/reports/owner/earnings-report`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Report generation failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Renterty-Earnings-Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("PDF Downloaded successfully", { id: "pdf-toast" });
    } catch (err) {
      toast.error(err.message, { id: "pdf-toast" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-teal-500 mr-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading analytics dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-left">
      {/* Download button row */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Earnings Analytics</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs">Overview of earnings and listings metrics.</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition"
        >
          <FileText className="h-4 w-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <div className="group bg-white/95 dark:bg-zinc-900/95 p-7 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          {/* Corner Ambient Glow */}
          <div className="absolute -right-8 -top-8 size-32 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="size-14 text-white rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-2xl shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 rounded-full text-xs font-bold">
                <span className="size-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span>Stripe Payouts</span>
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                Total Net Earnings
              </span>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                ${stats.totalEarnings.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="relative z-10 mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
            <span>Direct Deposit Active</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Total Properties */}
        <div className="group bg-white/95 dark:bg-zinc-900/95 p-7 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          {/* Corner Ambient Glow */}
          <div className="absolute -right-8 -top-8 size-32 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="size-14 text-white rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Building className="h-7 w-7 text-white" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Units</span>
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                Total Properties
              </span>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                {stats.totalProperties} <span className="text-lg sm:text-xl font-bold text-slate-500 dark:text-zinc-400">Listings</span>
              </h3>
            </div>
          </div>

          <div className="relative z-10 mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Portfolio 100% Listed</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Total Bookings */}
        <div className="group bg-white/95 dark:bg-zinc-900/95 p-7 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          {/* Corner Ambient Glow */}
          <div className="absolute -right-8 -top-8 size-32 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="size-14 text-white rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-2xl shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 rounded-full text-xs font-bold">
                <span className="size-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span>Verified Tenants</span>
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                Confirmed Bookings
              </span>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                {stats.totalBookings} <span className="text-lg sm:text-xl font-bold text-slate-500 dark:text-zinc-400">Slots</span>
              </h3>
            </div>
          </div>

          <div className="relative z-10 mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
            <span>Occupancy Verified</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="group bg-white/90 dark:bg-zinc-900/90 p-7 sm:p-9 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 transition-all duration-300 relative overflow-hidden">
        {/* Corner Ambient Glow */}
        <div className="absolute -right-12 -top-12 size-48 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 text-xs font-bold">
              <TrendingUp className="h-3.5 w-3.5 text-teal-500" />
              <span>Revenue Trajectory</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
              Monthly Earnings Trend (Last 12 Months)
            </h3>
          </div>

          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
            Updated in real-time with Stripe webhook reconciliation
          </span>
        </div>

        <div className="h-72 w-full relative z-10">
          {chartReady && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} initialDimension={{ width: 100, height: 100 }}>
              <LineChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(20, 184, 166, 0.3)",
                    borderRadius: "16px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "10px 14px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Earnings"
                  stroke="url(#colorEarnings)"
                  strokeWidth={3.5}
                  dot={{ r: 4, strokeWidth: 2, fill: "#14b8a6" }}
                  activeDot={{ r: 7, fill: "#10b981", strokeWidth: 3, stroke: "#fff" }}
                />
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Feature 8: AI Tenant Review Sentiment & Topic Insights */}
      <ReviewInsights ownerId={user?.id} />
    </div>
  );
}
