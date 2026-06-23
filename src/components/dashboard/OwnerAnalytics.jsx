"use client";

import React, { useState, useEffect } from "react";
import { Loader2, DollarSign, Building, Calendar, FileText, TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import toast from "react-hot-toast";

export default function OwnerAnalytics() {
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
      const bookingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/owner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Fetch properties to calculate total properties
      const propsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/owner`, {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/owner/earnings-report`, {
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
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <FileText className="h-4 w-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-3xl border border-slate-200/60 dark:border-zinc-800/60 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-teal-500/10 text-teal-500 rounded-2xl">
            <DollarSign className="h-8 w-8" />
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">TOTAL EARNINGS</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">${stats.totalEarnings.toLocaleString()}</h3>
          </div>
        </div>

        {/* Total Properties */}
        <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-3xl border border-slate-200/60 dark:border-zinc-800/60 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-teal-500/10 text-teal-500 rounded-2xl">
            <Building className="h-8 w-8" />
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">TOTAL PROPERTIES</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalProperties} Listings</h3>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-3xl border border-slate-200/60 dark:border-zinc-800/60 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-teal-500/10 text-teal-500 rounded-2xl">
            <Calendar className="h-8 w-8" />
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">CONFIRMED BOOKINGS</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalBookings} Slots</h3>
          </div>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-3xl border border-slate-200/60 dark:border-zinc-800/60 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center space-x-1.5">
          <TrendingUp className="h-5 w-5 text-teal-500" />
          <span>Monthly Earnings Trend (Last 12 Months)</span>
        </h3>
        <div className="h-72 w-full">
          {chartReady && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} initialDimension={{ width: 100, height: 100 }}>
              <LineChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Earnings"
                  stroke="url(#colorEarnings)"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
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
    </div>
  );
}
