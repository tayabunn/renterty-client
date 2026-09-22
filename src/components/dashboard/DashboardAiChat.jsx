"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Bot,
  User,
  Send,
  Plus,
  Trash2,
  MessageSquare,
  Search,
  Copy,
  Check,
  RefreshCw,
  Mic,
  MicOff,
  ChevronRight,
  ShieldCheck,
  Building,
  DollarSign,
  Wrench,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowRight,
  Clock,
  Sparkle,
  Pencil,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { aiAssistantMessage } from "../../lib/ai";

export default function DashboardAiChat({ user }) {
  const userRole = user?.role || "Tenant";
  const userId = user?.id || user?._id || "guest";
  const storageKey = `renterty_aichat_sessions_${userId}`;

  // Session state
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [searchHistory, setSearchHistory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Chat conversation state
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize and load sessions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load AI chat sessions from localStorage:", e);
    }
    // Create initial default session if none exists
    createNewSession();
  }, [storageKey]);

  // Persist sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(sessions));
      } catch (e) {
        console.warn("Could not save AI chat sessions to localStorage:", e);
      }
    }
  }, [sessions, storageKey]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeSessionId, isLoading]);

  // Get active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Create a new session
  const createNewSession = () => {
    const newSession = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: "New Conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInputMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Delete a session
  const deleteSession = (e, sessionId) => {
    e.stopPropagation();
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (filtered.length === 0) {
        const fresh = {
          id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          title: "New Conversation",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: []
        };
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
    toast.success("Conversation deleted");
  };

  // Clear all sessions
  const clearAllSessions = () => {
    if (window.confirm("Are you sure you want to clear all your AI chat history?")) {
      localStorage.removeItem(storageKey);
      createNewSession();
      toast.success("Chat history cleared");
    }
  };

  // Voice speech-to-text integration
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        toast("Listening for your query...", { icon: "🎙️" });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech error:", err);
      setIsListening(false);
    }
  };

  // Message editing state
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const editTextareaRef = useRef(null);

  // Copy message to clipboard
  const copyMessage = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Message copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Start editing a user message
  const startEditingMessage = (index, text) => {
    setEditingMessageIndex(index);
    setEditingText(text);
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.style.height = "auto";
        editTextareaRef.current.style.height = `${Math.min(editTextareaRef.current.scrollHeight, 160)}px`;
        editTextareaRef.current.focus();
      }
    }, 50);
  };

  // Cancel editing
  const cancelEditingMessage = () => {
    setEditingMessageIndex(null);
    setEditingText("");
  };

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  // Submit edited message (ChatGPT style: truncates after this message and regenerates response)
  const submitEditedMessage = async (index) => {
    const text = editingText.trim();
    if (!text || isLoading) return;

    setEditingMessageIndex(null);
    setEditingText("");
    setIsLoading(true);

    const currentMessages = activeSession?.messages || [];
    const updatedUserMsg = {
      ...currentMessages[index],
      content: text,
      timestamp: new Date().toISOString()
    };

    // Truncate messages after this point like ChatGPT
    const truncatedMessages = [...currentMessages.slice(0, index), updatedUserMsg];

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              updatedAt: new Date().toISOString(),
              messages: truncatedMessages
            }
          : s
      )
    );

    try {
      const historyPayload = truncatedMessages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await aiAssistantMessage(text, historyPayload);

      let replyContent = "I encountered an issue processing your request. Please try again.";
      let properties = [];
      let actions = [];

      if (res && res.success !== false) {
        replyContent = res.reply || res.message || res.text || "Here is what I found.";
        properties = res.properties || [];
        actions = res.actions || [];
      } else if (res?.error) {
        replyContent = `Error: ${res.error}`;
      }

      const assistantMessage = {
        id: `msg_a_${Date.now()}`,
        role: "assistant",
        content: replyContent,
        properties: properties,
        actions: actions,
        timestamp: new Date().toISOString()
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...truncatedMessages, assistantMessage]
              }
            : s
        )
      );
    } catch (err) {
      console.error("AI Assistant edit error:", err);
      const errorMessage = {
        id: `msg_err_${Date.now()}`,
        role: "assistant",
        content: "Sorry, I couldn't reach the AI service. Please check your network connection and try again.",
        timestamp: new Date().toISOString()
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...truncatedMessages, errorMessage]
              }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (customPrompt = null) => {
    const text = (customPrompt || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `msg_u_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    };

    // Update session title on first message if default
    const isFirstUserMessage = (!activeSession?.messages || activeSession.messages.length === 0);
    const sessionTitle = isFirstUserMessage
      ? text.length > 36
        ? `${text.substring(0, 36)}...`
        : text
      : activeSession?.title;

    // Append user message immediately
    const updatedMessages = [...(activeSession?.messages || []), userMessage];

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: isFirstUserMessage ? sessionTitle : s.title,
              updatedAt: new Date().toISOString(),
              messages: updatedMessages
            }
          : s
      )
    );

    setInputMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    try {
      // Build conversation history payload for LLM context (sliding window)
      const historyPayload = updatedMessages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await aiAssistantMessage(text, historyPayload);

      let replyContent = "I encountered an issue processing your request. Please try again.";
      let properties = [];
      let actions = [];

      if (res && res.success !== false) {
        replyContent = res.reply || res.message || res.text || "Here is what I found.";
        properties = res.properties || [];
        actions = res.actions || [];
      } else if (res?.error) {
        replyContent = `Error: ${res.error}`;
      }

      const assistantMessage = {
        id: `msg_a_${Date.now()}`,
        role: "assistant",
        content: replyContent,
        properties: properties,
        actions: actions,
        timestamp: new Date().toISOString()
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...updatedMessages, assistantMessage]
              }
            : s
        )
      );
    } catch (err) {
      console.error("AI Assistant send error:", err);
      const errorMessage = {
        id: `msg_err_${Date.now()}`,
        role: "assistant",
        content: "Sorry, I couldn't reach the AI service. Please check your network connection and try again.",
        timestamp: new Date().toISOString()
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...updatedMessages, errorMessage]
              }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcut (Enter to send, Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group sessions by timeline
  const groupSessionsByTimeline = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      Older: []
    };

    const filtered = sessions.filter((s) =>
      s.title?.toLowerCase().includes(searchHistory.toLowerCase())
    );

    filtered.forEach((session) => {
      const sessionDate = new Date(session.updatedAt || session.createdAt);
      if (sessionDate >= today) {
        groups.Today.push(session);
      } else if (sessionDate >= yesterday) {
        groups.Yesterday.push(session);
      } else if (sessionDate >= lastWeek) {
        groups["Previous 7 Days"].push(session);
      } else {
        groups.Older.push(session);
      }
    });

    return groups;
  };

  // Role-specific starter suggestions
  const getRoleStarterPrompts = () => {
    if (userRole === "Admin") {
      return [
        {
          title: "Platform Revenue & Growth",
          prompt: "Summarize platform transaction volume, commission take-rates, and monthly growth benchmarks.",
          icon: DollarSign
        },
        {
          title: "Listing Quality & Fraud Audit",
          prompt: "Audit active listings for anomalous pricing, low image resolution, or deposit risk indicators.",
          icon: ShieldCheck
        },
        {
          title: "Tenancy Dispute Resolution",
          prompt: "Provide statutory dispute resolution guidelines and mediation steps for security deposit conflicts.",
          icon: Building
        },
        {
          title: "Maintenance CapEx Schedule",
          prompt: "Evaluate emergency maintenance SLA dispatch performance and CapEx budget allocation.",
          icon: Wrench
        }
      ];
    }

    if (userRole === "Owner") {
      return [
        {
          title: "Rental Yield & Price Estimator",
          prompt: "Estimate the optimal rental price and yield for a 2-bedroom modern apartment with parking.",
          icon: DollarSign
        },
        {
          title: "High-Converting Listing Copy",
          prompt: "Write a high-converting, premium listing description highlighting luxury amenities and location.",
          icon: Sparkles
        },
        {
          title: "Tenant Screening Questions",
          prompt: "What are the most effective compliance-ready screening questions for prospective tenant applications?",
          icon: ShieldCheck
        },
        {
          title: "Preventative Maintenance Schedule",
          prompt: "Create a quarterly HVAC and plumbing preventative maintenance schedule for a residential property.",
          icon: Wrench
        }
      ];
    }

    // Tenant Default
    return [
      {
        title: "Find 2-Bed Apartments",
        prompt: "Find 2-bedroom apartments near city center under $2,500 with balcony and in-unit laundry.",
        icon: Building
      },
      {
        title: "Lease & Deposit Rights",
        prompt: "What are my statutory tenant rights regarding security deposit returns and move-in inspection reports?",
        icon: ShieldCheck
      },
      {
        title: "Draft a Maintenance Ticket",
        prompt: "Help me write a clear, polite maintenance request to my landlord for a leaking bathroom faucet.",
        icon: Wrench
      },
      {
        title: "Neighborhood Rent Comps",
        prompt: "What is the average rent per square foot for modern studios vs 1-bedroom units in this area?",
        icon: DollarSign
      }
    ];
  };

  const starterPrompts = getRoleStarterPrompts();
  const groupedSessions = groupSessionsByTimeline();

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[580px] bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-lg overflow-hidden transition-colors duration-300">
      {/* ========================================================================= */}
      {/* LEFT DRAWER: SESSION HISTORY & NEW CHAT */}
      {/* ========================================================================= */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full bg-slate-50 dark:bg-zinc-950 border-r border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between shrink-0 overflow-hidden"
          >
            {/* Top: New Chat Button & Search */}
            <div className="p-3.5 space-y-2.5 border-b border-slate-200/80 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={createNewSession}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Chat</span>
                </div>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                  {sessions.length}
                </span>
              </button>

              {/* History Search Input */}
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Middle: Grouped Chat Sessions List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-4 no-scrollbar">
              {Object.entries(groupedSessions).map(([groupTitle, list]) => {
                if (list.length === 0) return null;
                return (
                  <div key={groupTitle} className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-2 block">
                      {groupTitle}
                    </span>
                    <div className="space-y-0.5">
                      {list.map((session) => {
                        const isActive = session.id === activeSessionId;
                        return (
                          <div
                            key={session.id}
                            onClick={() => setActiveSessionId(session.id)}
                            className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              isActive
                                ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/30"
                                : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate pr-1">
                              <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-teal-500" : "text-slate-400 dark:text-zinc-500"}`} />
                              <span className="truncate">{session.title || "New Chat"}</span>
                            </div>

                            <button
                              type="button"
                              title="Delete conversation"
                              onClick={(e) => deleteSession(e, session.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {sessions.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400 dark:text-zinc-500">
                  No conversation history yet.
                </div>
              )}
            </div>

            {/* Bottom: Clear All History */}
            <div className="p-2.5 border-t border-slate-200/80 dark:border-zinc-800/80 bg-slate-100/50 dark:bg-zinc-950/50 flex items-center justify-between px-3">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                {sessions.length} saved {sessions.length === 1 ? "session" : "sessions"}
              </span>
              <button
                type="button"
                onClick={clearAllSessions}
                className="text-[11px] font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MAIN CHAT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col justify-between h-full min-w-0 bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Top Chat Header Bar */}
        <header className="px-4 py-3 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
            >
              {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </button>

            <div className="truncate">
              <div className="flex items-center space-x-2">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {activeSession?.title || "Renterty AI Assistant"}
                </h2>
                <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 uppercase tracking-wider">
                  {userRole} Mode
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={createNewSession}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </header>

        {/* Conversation Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {(!activeSession?.messages || activeSession.messages.length === 0) ? (
            /* Empty State: Welcoming Screen & Prompt Suggestions */
            <div className="max-w-2xl mx-auto h-full flex flex-col items-center justify-center text-center py-6 space-y-6">
              <div className="space-y-2">
                <div className="size-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                  <Bot className="h-6 w-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  How can I help you today, {user?.name?.split(" ")[0] || userRole}?
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Ask me anything about property discovery, legal lease rights, rental yield estimation, or platform operations.
                </p>
              </div>

              {/* Starter Suggestion Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                {starterPrompts.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(item.prompt)}
                      className="p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-800/50 hover:bg-teal-50/50 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 text-left transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        <Icon className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-snug">
                        {item.prompt}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Message List */
            <div className="max-w-3xl mx-auto space-y-6">
              {activeSession.messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <div className="shrink-0 pt-0.5">
                      {isUser ? (
                        user?.photo ? (
                          <img
                            src={user.photo}
                            alt={user.name}
                            className="size-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="size-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                            {user?.name ? user.name[0].toUpperCase() : "U"}
                          </div>
                        )
                      ) : (
                        <div className="size-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    {/* Message Bubble Container */}
                    <div className={`space-y-1.5 max-w-[85%] sm:max-w-[80%] ${isUser ? "text-right" : "text-left"}`}>
                      <div className={`flex items-center space-x-2 text-[10px] text-slate-400 dark:text-zinc-500 px-1 ${isUser ? "justify-end" : "justify-start"}`}>
                        <span className="font-semibold">{isUser ? "You" : "Renterty AI"}</span>
                        <span>·</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>

                      {/* User message is in active inline edit mode */}
                      {isUser && editingMessageIndex === idx ? (
                        <div className="space-y-2 w-full min-w-[260px] sm:min-w-[340px] text-left">
                          <div className="bg-slate-50 dark:bg-zinc-800/90 border border-teal-500 rounded-lg p-2.5 transition-all">
                            <textarea
                              ref={editTextareaRef}
                              value={editingText}
                              onChange={(e) => {
                                setEditingText(e.target.value);
                                e.target.style.height = "auto";
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  submitEditedMessage(idx);
                                } else if (e.key === "Escape") {
                                  e.preventDefault();
                                  cancelEditingMessage();
                                }
                              }}
                              rows={2}
                              className="w-full bg-transparent resize-none outline-none text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 leading-relaxed"
                              placeholder="Edit your message..."
                            />
                          </div>

                          <div className="flex items-center justify-end space-x-2 text-xs">
                            <button
                              type="button"
                              onClick={cancelEditingMessage}
                              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors font-medium cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => submitEditedMessage(idx)}
                              disabled={!editingText.trim() || isLoading}
                              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white font-bold transition-colors cursor-pointer"
                            >
                              <Send className="h-3 w-3" />
                              <span>Save & Submit</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal Message Bubble */
                        <div
                          className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                            isUser
                              ? "bg-teal-500 text-white font-medium text-left"
                              : "bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 text-slate-800 dark:text-zinc-200"
                          }`}
                        >
                          <div className="whitespace-pre-wrap font-sans text-xs">{msg.content}</div>

                          {/* Embedded Property Cards if available */}
                          {msg.properties && msg.properties.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-zinc-700">
                              {msg.properties.map((prop) => (
                                <Link
                                  key={prop._id || prop.id}
                                  href={`/properties/${prop._id || prop.id}`}
                                  className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-teal-500 transition-colors block text-left group"
                                >
                                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                    {prop.title}
                                  </div>
                                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                                    {prop.location}
                                  </div>
                                  <div className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-1">
                                    ${prop.rent?.toLocaleString() || "N/A"}{" "}
                                    <span className="text-[10px] text-slate-400">/{prop.rentType || "mo"}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Strip (Edit & Copy for User, Copy for Assistant) */}
                      {editingMessageIndex !== idx && (
                        <div className={`flex items-center space-x-3 pt-0.5 px-1 ${isUser ? "justify-end" : "justify-start"}`}>
                          {isUser ? (
                            <>
                              <button
                                type="button"
                                title="Edit message"
                                onClick={() => startEditingMessage(idx, msg.content)}
                                className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                              >
                                <Pencil className="h-3 w-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                title="Copy message"
                                onClick={() => copyMessage(msg.content, idx)}
                                className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                              >
                                {copiedIndex === idx ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-500" />
                                    <span className="text-emerald-500">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => copyMessage(msg.content, idx)}
                              className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-500" />
                                  <span className="text-emerald-500">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing / Processing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3"
                >
                  <div className="size-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400 flex items-center space-x-2">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-500" />
                    <span>Analyzing platform telemetry and formulating response...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            <div className="relative flex items-end bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 focus-within:border-teal-500 transition-colors">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${userRole} AI assistant... (Press Enter to send)`}
                rows={1}
                className="w-full bg-transparent resize-none outline-none text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 max-h-[160px] min-h-[24px] py-1 px-2 leading-relaxed"
              />

              <div className="flex items-center space-x-1 shrink-0 pb-0.5">
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  title="Voice dictation"
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    isListening
                      ? "bg-rose-500 text-white animate-pulse"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-700/60"
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  title="Send message"
                  className="p-2 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white transition-colors cursor-pointer shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500 px-1">
              <span>Powered by Gemini 3.8 Flash & Groq LPU with multi-session memory</span>
              <span>Shift + Enter for new line</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
