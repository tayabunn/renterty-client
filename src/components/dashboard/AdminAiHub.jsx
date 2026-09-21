"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Bot, Search, Wrench, Camera, Calculator, Activity,
  RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Zap,
  Clock, ArrowUpRight, Filter, ChevronRight, Layers, Cpu,
  Send, Play, FileText, Check, Copy, ChevronDown, ChevronUp,
  Sliders, UserCheck, Scale, BarChart3
} from "lucide-react";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";

export default function AdminAiHub() {
  const [activeTab, setActiveTab] = useState("agents"); // "agents" | "telemetry"
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState("all");

  // Agent Session State
  const [profiles, setProfiles] = useState({});
  const [selectedProfile, setSelectedProfile] = useState("PORTFOLIO_ANALYSIS");
  const [objective, setObjective] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [sandboxProvider, setSandboxProvider] = useState("local_node");
  const [sandboxStatus, setSandboxStatus] = useState({
    status: "connected",
    workspaceDirectory: "/workspace",
    environmentType: "self_hosted",
    outboundUrl: "wss://codex-cloud-environments.chatgpt.com"
  });
  const [activeSession, setActiveSession] = useState(null);
  const [sessionsList, setSessionsList] = useState([]);
  const [isLaunching, setIsLaunching] = useState(false);
  const [steerInput, setSteerInput] = useState("");
  const [isSteering, setIsSteering] = useState(false);
  const [expandedSubagents, setExpandedSubagents] = useState({});
  const [copiedArtifact, setCopiedArtifact] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const fetchSandboxStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/ai/agent/sandbox/status`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.sandbox) {
          setSandboxStatus(data.sandbox);
        }
      }
    } catch (err) {
      console.warn("Could not load sandbox status:", err);
    }
  };

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
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAgentProfiles = async () => {
    try {
      const res = await fetch(`${API_URL}/ai/agent/profiles`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profiles) {
          setProfiles(data.profiles);
        }
      }
    } catch (err) {
      console.warn("Could not load Agent profiles:", err);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/ai/agent/sessions`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.sessions) {
          setSessionsList(data.sessions);
          if (!activeSession && data.sessions.length > 0) {
            setActiveSession(data.sessions[0]);
          }
        }
      }
    } catch (err) {
      console.warn("Could not load agent sessions:", err);
    }
  };

  useEffect(() => {
    fetchAiStats();
    fetchAgentProfiles();
    fetchSessions();
    fetchSandboxStatus();
  }, []);

  // Poll active session if it is running
  useEffect(() => {
    if (!activeSession || activeSession.status !== "running") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/ai/agent/session/${activeSession.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.session) {
            setActiveSession(data.session);
            if (data.session.status !== "running") {
              fetchSessions();
            }
          }
        }
      } catch (err) {
        console.warn("Poll session error:", err);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [activeSession]);

  const handleLaunchSession = async (e) => {
    e?.preventDefault();
    setIsLaunching(true);
    const token = localStorage.getItem("renterty_token");

    try {
      const res = await fetch(`${API_URL}/ai/agent/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          profileId: selectedProfile,
          objective: objective.trim() || undefined,
          customInstructions: customInstructions.trim() || undefined,
          environment: {
            type: "self_hosted",
            provider: sandboxProvider,
            workspace_directory: sandboxStatus?.workspaceDirectory || "/workspace"
          }
        })
      });

      const data = await res.json();
      if (data.success && data.session) {
        setActiveSession(data.session);
        setSessionsList(prev => [data.session, ...prev.filter(s => s.id !== data.session.id)]);
        toast.success("Autonomous multi-agent mission dispatched!");
      } else {
        toast.error(data.error || "Failed to launch agent session");
      }
    } catch (err) {
      toast.error("Network error launching agent session");
    } finally {
      setIsLaunching(false);
    }
  };

  const handleSendSteer = async (e) => {
    e?.preventDefault();
    if (!steerInput.trim() || !activeSession) return;
    setIsSteering(true);
    const token = localStorage.getItem("renterty_token");

    try {
      const res = await fetch(`${API_URL}/ai/agent/session/${activeSession.id}/turn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userMessage: steerInput.trim() })
      });

      const data = await res.json();
      if (data.success && data.session) {
        setActiveSession(data.session);
        setSteerInput("");
        toast.success("Steering directive processed by Lead Orchestrator");
      } else {
        toast.error(data.error || "Failed to submit steering directive");
      }
    } catch (err) {
      toast.error("Network error sending steer directive");
    } finally {
      setIsSteering(false);
    }
  };

  const toggleSubagentExpand = (id) => {
    setExpandedSubagents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyArtifactToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedArtifact(true);
    toast.success("Dossier copied to clipboard!");
    setTimeout(() => setCopiedArtifact(false), 2000);
  };

  const aiServices = [
    {
      name: "NLP Smart Property Search",
      desc: "Converts natural language queries to structured DB filters",
      icon: Search,
      accuracy: "99.1%",
      latency: "45ms",
      status: "Operational",
      badge: "Groq Llama 3.3 70B",
      color: "from-teal-500 to-emerald-500"
    },
    {
      name: "Voice Search & Transcription",
      desc: "Transcribes user speech into property queries via Whisper Turbo",
      icon: Sparkles,
      accuracy: "98.7%",
      latency: "95ms",
      status: "Operational",
      badge: "Groq Whisper Turbo",
      color: "from-teal-500 to-emerald-500"
    },
    {
      name: "AI Maintenance Triage",
      desc: "Classifies repair severity & generates safety suggestions.",
      icon: Wrench,
      accuracy: "96.4%",
      latency: "80ms",
      status: "Operational",
      badge: "Groq Llama 3.1 8B",
      color: "from-teal-500 to-emerald-500"
    },
    {
      name: "Dynamic Rent Estimator",
      desc: "Calculates market valuation variance by beds, location & size.",
      icon: Calculator,
      accuracy: "95.2%",
      latency: "60ms",
      status: "Operational",
      badge: "Real-time Comp",
      color: "from-teal-500 to-emerald-500"
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

  const presetObjectives = [
    { label: "Portfolio Yield & Comps Audit", profile: "PORTFOLIO_ANALYSIS", text: "Evaluate all 2-bed & 3-bed listings against current market comps, compute cap rates, and recommend dynamic price lifts." },
    { label: "Lease & Deposit Compliance Review", profile: "LEGAL_COMPLIANCE", text: "Audit residential tenancy agreements for statutory deposit ceilings, eviction cure periods, and liability protections." },
    { label: "Applicant Risk & Income Underwriting", profile: "TENANT_UNDERWRITING", text: "Analyze applicant income ratios, verify 3x rent coverage, and cross-reference behavioral payment telemetry." },
    { label: "CapEx & Preventive Maintenance Schedule", profile: "MAINTENANCE_CAPEX", text: "Forecast annual HVAC and plumbing CapEx depreciation and optimize high-priority emergency vendor routing." }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Bot className="h-3.5 w-3.5" />
              <span>INTELLIGENT OPERATIONS & AGENTS API</span>
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span>MULTI-AGENT ORCHESTRATION</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            AI Operations & Multi-Agent Lab
          </h1>
          <p className="text-base text-slate-500 dark:text-zinc-400">
            Dispatch autonomous multi-agent research missions, steer durable sessions, and monitor real-time Groq LPU throughput
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200/80 dark:border-zinc-700">
          <button
            onClick={() => setActiveTab("agents")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "agents"
                ? "bg-teal-500 text-white"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Agents API Orchestrator</span>
          </button>
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "telemetry"
                ? "bg-teal-500 text-white"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Service Telemetry & Logs</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AGENTS API MULTI-AGENT ORCHESTRATOR */}
      {/* ========================================================================= */}
      {activeTab === "agents" && (
        <div className="space-y-8">
          {/* Self-Hosted Sandbox Status & Codex Runner Strip */}
          <div className="p-4 sm:p-5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 hover:border-teal-500/40 dark:hover:border-teal-500/40">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Self-Hosted Sandbox Environment Active
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 px-2 py-0.5 rounded-full font-mono">
                  {sandboxStatus.workspaceDirectory || "/workspace"}
                </span>
                <span className="text-[10px] bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-mono">
                  {sandboxStatus.environmentId ? `${sandboxStatus.environmentId.slice(0, 18)}...` : "ccarenv_b64_..."}
                </span>
                <span className="text-[10px] bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                  {sandboxStatus.sessionId ? `${sandboxStatus.sessionId.slice(0, 16)}...` : "sess_..."}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Connected via Remote <span className="text-teal-600 dark:text-teal-400 font-mono font-medium">{sandboxStatus.remoteUrl || "https://api.openai.com/v1/agents/api/connect/rt_2q8p"}</span>
                {sandboxStatus.sessionId && (
                  <span className="ml-2 text-slate-400 dark:text-zinc-500 font-mono text-[11px]">| Session: {sandboxStatus.sessionId}</span>
                )}
              </p>
            </div>

            <div className="flex items-center space-x-2 self-stretch md:self-auto">
              <div className="flex-1 md:flex-initial flex items-center bg-slate-50 dark:bg-zinc-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 font-mono text-[11px] text-slate-700 dark:text-zinc-300 select-all overflow-x-auto">
                <span>codex exec-server --remote &ldquo;https://api.openai...&rdquo;</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const cmd = sandboxStatus.execCommand || `CODEX_API_KEY='<YOUR_CODEX_API_KEY>' \\\n  codex exec-server \\\n    --remote 'https://api.openai.com/v1/agents/api/connect/rt_2q8p' \\\n    --environment-id 'ccarenv_b64_Y2NhcmVudl82YWIwNTljZTM0NjQ4MTkxYmRiMTgzYWJmOTZjNGQxNw'`;
                  navigator.clipboard.writeText(cmd);
                  setCopiedCmd(true);
                  toast.success("Codex exec-server connection command copied!");
                  setTimeout(() => setCopiedCmd(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 hover:bg-teal-100 dark:hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold border border-teal-500/30 transition-colors cursor-pointer shrink-0"
              >
                {copiedCmd ? "Copied!" : "Copy Exec Command"}
              </button>
            </div>
          </div>

          {/* Mission Dispatcher Card */}
          <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-teal-500" />
                  <span>Autonomous Multi-Agent Mission Dispatcher</span>
                </h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Powered by OpenAI Agents API sessions & Groq LPU subagent trees with sandboxed database execution
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2">
                {presetObjectives.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setSelectedProfile(p.profile);
                      setObjective(p.text);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200 dark:border-zinc-700 transition-colors cursor-pointer"
                  >
                    + {p.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLaunchSession} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Domain Selector */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Agent Mission Profile
                  </label>
                  <select
                    value={selectedProfile}
                    onChange={(e) => setSelectedProfile(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="PORTFOLIO_ANALYSIS">🏢 Portfolio Comps & Yield Optimizer</option>
                    <option value="LEGAL_COMPLIANCE">⚖️ Lease & Tenancy Legal Risk Auditor</option>
                    <option value="TENANT_UNDERWRITING">🛡️ Tenant Risk & Underwriting Agent</option>
                    <option value="MAINTENANCE_CAPEX">🔧 CapEx & Maintenance AI Orchestrator</option>
                  </select>
                </div>

                {/* Sandbox Provider Selector */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Execution Sandbox Provider
                  </label>
                  <select
                    value={sandboxProvider}
                    onChange={(e) => setSandboxProvider(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="local_node">💻 Self-Hosted Node.js / Codex Local Sandbox</option>
                    <option value="modal">☁️ Modal Cloud Compute Container</option>
                    <option value="cloudflare">⚡ Cloudflare Workers Isolated Sandbox</option>
                    <option value="e2b">🛡️ E2B Secure Code Sandbox</option>
                    <option value="docker">🐳 Docker Self-Hosted Container</option>
                  </select>
                </div>

                {/* Objective Input */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Mission Objective & Target Parameters
                  </label>
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="e.g., Audit current portfolio listings, calculate optimal rent adjustments, and flag lease risks..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-400 dark:text-zinc-500 flex items-center space-x-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Durable sandbox session with automated recovery and multi-turn steering</span>
                </div>

                <button
                  type="submit"
                  disabled={isLaunching}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold shadow-md shadow-teal-500/20 hover:from-teal-600 hover:to-emerald-600 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLaunching ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Orchestrating Subagents...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Launch Multi-Agent Mission</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Active Session Viewer / Graph */}
          {activeSession ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Multi-Agent Execution Graph & Subagent Trees */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-6 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-teal-500" />
                      <span>Agent Hierarchy</span>
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeSession.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : activeSession.status === "running"
                        ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 animate-pulse"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}>
                      {activeSession.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Lead Agent Node */}
                  <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-300">
                      <span className="flex items-center space-x-1.5">
                        <Bot className="h-4 w-4 text-teal-500" />
                        <span>Lead Orchestrator</span>
                      </span>
                      <span className="text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-md">Root</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 line-clamp-2">
                      {activeSession.objective}
                    </p>
                  </div>

                  {/* Subagent Tree Items */}
                  <div className="space-y-3 pt-2">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      Delegated Subagents ({activeSession.subagents?.length || 0})
                    </div>

                    {activeSession.subagents?.map((sa) => {
                      const isExpanded = expandedSubagents[sa.id];
                      return (
                        <div
                          key={sa.id}
                          className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 overflow-hidden transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => toggleSubagentExpand(sa.id)}
                            className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-zinc-700/40 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center space-x-2">
                              <span className={`h-2 w-2 rounded-full ${
                                sa.status === "completed" ? "bg-emerald-500" : sa.status === "running" ? "bg-teal-500 animate-ping" : "bg-slate-300 dark:bg-zinc-600"
                              }`} />
                              <div>
                                <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                  {sa.name}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-zinc-400 line-clamp-1">
                                  {sa.role}
                                </div>
                              </div>
                            </div>

                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="p-3 border-t border-slate-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900/60 text-xs text-slate-600 dark:text-zinc-300 whitespace-pre-line font-mono text-[11px] leading-relaxed">
                              {sa.findings || "Analyzing platform database and evaluating telemetry..."}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Past Sessions List */}
                  {sessionsList.length > 1 && (
                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                        Session History
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                        {sessionsList.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setActiveSession(s)}
                            className={`w-full text-left p-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                              activeSession.id === s.id
                                ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                                : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                            }`}
                          >
                            <span className="truncate">{s.profileName || s.id}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Generated Artifact Dossier & Steer Turn Input */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-6">
                  {/* Artifact Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
                    <div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-teal-500" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Strategic Dossier & Action Plan
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Synthesized by Lead Orchestrator from multi-agent subagent findings and verified DB telemetry
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyArtifactToClipboard(activeSession.finalSynthesis || "")}
                      disabled={!activeSession.finalSynthesis}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50 self-end sm:self-auto"
                    >
                      {copiedArtifact ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Dossier</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Artifact Content Area */}
                  <div className="min-h-[280px] max-h-[480px] overflow-y-auto p-5 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/60 dark:border-zinc-800/80 font-sans text-xs leading-relaxed text-slate-800 dark:text-zinc-200 whitespace-pre-wrap selection:bg-teal-500 selection:text-white">
                    {activeSession.finalSynthesis ? (
                      activeSession.finalSynthesis
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-3">
                        <RefreshCw className="h-6 w-6 animate-spin text-teal-500" />
                        <span>Subagents are aggregating database telemetry and formulating synthesis...</span>
                      </div>
                    )}
                  </div>

                  {/* Steering Input / Multi-Turn Continuation */}
                  <form onSubmit={handleSendSteer} className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Steer Active Mission (Multi-turn session directive)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={steerInput}
                        onChange={(e) => setSteerInput(e.target.value)}
                        placeholder="e.g., Focus specifically on 3-bedroom units in Gulshan and verify statutory deposit limits..."
                        disabled={isSteering || activeSession.status === "running"}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-teal-500 outline-none disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={isSteering || !steerInput.trim() || activeSession.status === "running"}
                        className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isSteering ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span>Steer</span>
                          </>
                        )}
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-zinc-500 mt-1 block">
                      Directives are injected into the agent loop to refine outputs and update artifacts without losing session state
                    </span>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-lg bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-800 space-y-3">
              <Bot className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">No active agent session</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                Select a mission profile above and click &ldquo;Launch Multi-Agent Mission&rdquo; to spawn autonomous subagents.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SERVICE TELEMETRY & AUDIT LOGS */}
      {/* ========================================================================= */}
      {activeTab === "telemetry" && (
        <div className="space-y-8">
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
                      <div className={`p-2.5 rounded-lg bg-linear-to-tr ${svc.color} text-white group-hover:scale-105 transition-transform`}>
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
                      <p className="text-[13px] leading-snug text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            {/* Listing Quality Health Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="p-4 sm:p-5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between h-full space-y-3"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-teal-500" />
                  <span>Listing Quality Index</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  AI Vision assessment distribution across active properties.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 text-center space-y-0.5">
                  <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">91.4 / 100</span>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-zinc-200">Platform Quality Score</div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-400">Based on photo resolution, verified amenities & descriptions.</div>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-teal-600 dark:text-teal-400">High Quality (85-100)</span>
                      <span className="text-slate-700 dark:text-zinc-300">78%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full w-[78%]" />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-700 dark:text-zinc-300">Adequate (70-84)</span>
                      <span className="text-slate-600 dark:text-zinc-400">18%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500/50 dark:bg-teal-400/40 rounded-full w-[18%]" />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500 dark:text-zinc-400">Needs Review (&lt;70)</span>
                      <span className="text-slate-500 dark:text-zinc-500">4%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-300 dark:bg-zinc-700 rounded-full w-[4%]" />
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
              className="lg:col-span-2 p-4 sm:p-5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between h-full space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-teal-500" />
                    <span>Live AI Audit Trail</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Recent user prompts and processed NLP model results.
                  </p>
                </div>

                <div className="flex items-center space-x-1 p-0.5 bg-slate-100 dark:bg-zinc-800/80 rounded-lg w-fit">
                  {["all", "search", "maintenance", "estimator"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold capitalize transition-all ${
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

              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 flex-1">
                {filteredLogs.map((log) => (
                  <div
                    key={log._id || log.prompt}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 space-y-1 hover:border-teal-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        {log.type.replace("_", " ")}
                      </span>
                      <div className="flex items-center space-x-1.5 text-slate-400 text-[10px]">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-600 dark:text-zinc-400">{log.latency || "160ms"}</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                      &ldquo;{log.prompt}&rdquo;
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-1.5 rounded border border-slate-100 dark:border-zinc-800 font-mono truncate">
                      {log.responseSummary || "Processed query successfully."}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
