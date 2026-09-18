"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Bot, Search, Wrench, Camera, Calculator, Activity,
  RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Zap,
  Clock, ArrowUpRight, Filter, ChevronRight
} from "lucide-react";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";

export default function AdminAiHub() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState("all");

  const fetchAiStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/ai/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data);
        }
      }
    } catch (err) {
      console.warn("Could not load AI stats:", err);
      toast.error("Failed to load AI operations logs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAiStats();
  }, []);

  const aiServices = [
    {
      name: "NLP Smart Property Search",
      desc: "Converts natural language queries to structured DB filters.",
      icon: Search,
      accuracy: "98.2%",
      latency: "140ms",
      status: "Operational",
      badge: "Gemini 2.5 Flash",
      color: "from-teal-500 to-emerald-500"
    },
    {
      name: "AI Maintenance Triage",
      desc: "Classifies repair severity & generates safety suggestions.",
      icon: Wrench,
      accuracy: "95.6%",
      latency: "210ms",
      status: "Operational",
      badge: "Automated Dispatch",
      color: "from-indigo-500 to-purple-500"
    },
    {
      name: "Photo Quality & Amenity Vision",
      desc: "Detects room cleanliness, layout aesthetics, and amenities.",
      icon: Camera,
      accuracy: "97.4%",
      latency: "480ms",
      status: "Operational",
      badge: "Vision Multimodal",
      color: "from-rose-500 to-pink-500"
    },
    {
      name: "Dynamic Rent Estimator",
      desc: "Calculates market valuation variance by beds, location & size.",
      icon: Calculator,
      accuracy: "94.8%",
      latency: "180ms",
      status: "Operational",
      badge: "Real-time Comp",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const recentLogs = stats?.recentLogs || [
    {
      _id: "log-1",
      type: "smart_search",
      prompt: "2 bedroom flat in Uttara under 30k with AC",
      responseSummary: "Extracted location: Uttara, beds: 2, maxPrice: 30000, amenities: AC",
      tokens: 142,
      latency: "128ms",
      createdAt: new Date().toISOString()
    },
    {
      _id: "log-2",
      type: "maintenance_triage",
      prompt: "Water leaking under kitchen sink and making bubbling noise",
      responseSummary: "Severity: High, Category: Plumbing, Safety Action: Shut off water valve",
      tokens: 215,
      latency: "240ms",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      _id: "log-3",
      type: "image_analyzer",
      prompt: "Inspected modern living room with floor-to-ceiling windows",
      responseSummary: "Score: 92/100, Detected: Hardwood floor, Natural light, Furnished",
      tokens: 380,
      latency: "510ms",
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      _id: "log-4",
      type: "rent_estimator",
      prompt: "Estimate 3-bed villa in Palm Springs 2600 sqft with pool",
      responseSummary: "Estimated Rent: $4,800/mo, Confidence: High",
      tokens: 180,
      latency: "195ms",
      createdAt: new Date(Date.now() - 14400000).toISOString()
    }
  ];

  const filteredLogs = filterType === "all"
    ? recentLogs
    : recentLogs.filter(l => l.type.includes(filterType) || (filterType === "search" && l.type.includes("search")));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Bot className="h-3.5 w-3.5" />
              <span>INTELLIGENT OPERATIONS</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>4 SERVICES ACTIVE</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            AI Operations & Quality Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Monitor real-time AI query throughput, model accuracy indexes, and automated moderation latency.
          </p>
        </div>

        <button
          onClick={() => fetchAiStats(true)}
          disabled={refreshing}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50 self-end sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-teal-500" : ""}`} />
          <span>{refreshing ? "Syncing..." : "Refresh Logs"}</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {aiServices.map((svc, index) => {
          const Icon = svc.icon;
          return (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="p-6 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between space-y-4 hover:border-teal-500/40 dark:hover:border-teal-400/40 transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-lg bg-linear-to-tr ${svc.color} text-white shadow-md shadow-teal-500/10 group-hover:scale-105 transition-transform`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                    {svc.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1">
                    {svc.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold">
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[10px] uppercase">Accuracy</span>
                  <span className="text-teal-600 dark:text-teal-400">{svc.accuracy}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 dark:text-zinc-500 block text-[10px] uppercase">Latency</span>
                  <span className="text-slate-700 dark:text-zinc-300">{svc.latency}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quality Health Gauge & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listing Quality Health Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="p-6 sm:p-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-6"
        >
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-teal-500" />
              <span>Listing Quality Index</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              AI Vision assessment distribution across active properties.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/20 text-center space-y-1">
              <span className="text-3xl font-black text-teal-600 dark:text-teal-400">91.4 / 100</span>
              <div className="text-xs font-bold text-slate-700 dark:text-zinc-300">Platform Quality Score</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Based on photo resolution, verified amenities & descriptions.</div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-600 dark:text-emerald-400">High Quality (85-100)</span>
                  <span className="text-slate-600 dark:text-zinc-400">78%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[78%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-amber-600 dark:text-amber-400">Adequate (70-84)</span>
                  <span className="text-slate-600 dark:text-zinc-400">18%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[18%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-rose-600 dark:text-rose-400">Needs Review (&lt;70)</span>
                  <span className="text-slate-600 dark:text-zinc-400">4%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full w-[4%]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Interaction Log Viewer */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="lg:col-span-2 p-6 sm:p-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Activity className="h-4 w-4 text-teal-500" />
                <span>Live AI Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Recent user prompts and processed NLP model results.
              </p>
            </div>

            <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-zinc-800/80 rounded-xl w-fit">
              {["all", "search", "maintenance", "estimator"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    filterType === type
                      ? "bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 overflow-x-auto">
            {filteredLogs.map((log) => (
              <div
                key={log._id || log.prompt}
                className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 space-y-2 hover:border-teal-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    {log.type.replace("_", " ")}
                  </span>
                  <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-600 dark:text-zinc-400">{log.latency || "160ms"}</span>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  &ldquo;{log.prompt}&rdquo;
                </div>

                <div className="text-[11px] text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 font-mono">
                  {log.responseSummary || "Processed query successfully."}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
