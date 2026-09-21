"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Building,
  ArrowRight,
  StopCircle,
  RotateCcw,
  ChevronDown,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { streamAssistantMessage } from "../../lib/aiStream";
import GenerativeToolCard from "./GenerativeToolCard";
import VoiceSearchButton from "../ui/VoiceSearchButton";
import Link from "next/link";

// Lightweight Markdown Formatter for Assistant Messages
function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split("\n");

  const parseInline = (str) => {
    const tokens = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(str.substring(lastIndex, match.index));
      }
      const raw = match[0];
      if (raw.startsWith("**") && raw.endsWith("**")) {
        tokens.push(
          <strong key={`b-${match.index}`} className="font-bold text-slate-900 dark:text-white">
            {raw.slice(2, -2)}
          </strong>
        );
      } else if (raw.startsWith("*") && raw.endsWith("*")) {
        tokens.push(
          <em key={`i-${match.index}`} className="italic">
            {raw.slice(1, -1)}
          </em>
        );
      } else if (raw.startsWith("`") && raw.endsWith("`")) {
        tokens.push(
          <code
            key={`c-${match.index}`}
            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-teal-600 dark:text-teal-400 font-mono text-[11px]"
          >
            {raw.slice(1, -1)}
          </code>
        );
      } else if (raw.startsWith("[") && raw.includes("](") && raw.endsWith(")")) {
        const linkMatch = raw.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          tokens.push(
            <a
              key={`a-${match.index}`}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-teal-400 font-semibold underline hover:text-teal-700"
            >
              {linkMatch[1]}
            </a>
          );
        } else {
          tokens.push(raw);
        }
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      tokens.push(str.substring(lastIndex));
    }

    return tokens.length > 0 ? tokens : str;
  };

  return (
    <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
      {lines.map((line, lIdx) => {
        if (!line.trim()) {
          return <div key={lIdx} className="h-1.5" />;
        }

        const isBullet = line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ");
        const content = isBullet ? line.replace(/^([•\-\*]\s*)/, "") : line;

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start space-x-1.5 pl-0.5">
              <span className="text-teal-500 font-bold shrink-0 mt-0.5 text-xs">•</span>
              <div className="flex-1">{parseInline(content)}</div>
            </div>
          );
        }

        return <div key={lIdx}>{parseInline(content)}</div>;
      })}
    </div>
  );
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "msg_welcome",
      role: "assistant",
      content: "Hello! I'm your Renterty AI Rental Assistant. Ask me anything about finding properties, checking market rent estimates, scheduling tours, or understanding rental lease terms!",
      tool: null,
      suggestedActions: [
        "Show Modern Villas in Miami",
        "Estimate Rent for 2 Bed Apartment",
        "How do I Book a Rental with Stripe?",
        "Triage a Water Leak Maintenance Issue"
      ]
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [activeTool, setActiveTool] = useState(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Auto-scroll handler: sticks to bottom only if user hasn't scrolled up
  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsScrolledUp(distanceFromBottom > 60);
  };

  useEffect(() => {
    if (isOpen && !isScrolledUp) {
      scrollToBottom();
    }
  }, [messages, streamingText, activeTool, isOpen, isScrolledUp, scrollToBottom]);

  // Autofocus when opening
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom("auto");
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scrollToBottom]);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Stop Generation Handler (FE-06 Requirement)
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);

    if (streamingText || activeTool) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_stopped_${Date.now()}`,
          role: "assistant",
          content: streamingText ? `${streamingText}\n\n*(Response paused by user)*` : "Generation stopped.",
          tool: activeTool?.status === "success" ? activeTool : null,
          suggestedActions: ["Continue exploring listings", "Estimate rent price", "How to book?"]
        }
      ]);
    }

    setStreamingText("");
    setActiveTool(null);
    inputRef.current?.focus();
  };

  // Send / Stream Prompt Handler
  const handleSend = async (messageText) => {
    const text = messageText || input;
    if (!text.trim() || loading) return;

    const userMsgId = `user_${Date.now()}`;
    const userMessage = { id: userMsgId, role: "user", content: text.trim() };
    const historySnapshot = [...messages, userMessage];

    setMessages(historySnapshot);
    setInput("");
    setLoading(true);
    setStreamingText("");
    setActiveTool(null);
    setIsScrolledUp(false);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulatedText = "";
    let finalToolResult = null;
    let finalSuggestedActions = [];

    try {
      await streamAssistantMessage({
        message: text.trim(),
        conversationHistory: historySnapshot.map((m) => ({ role: m.role, content: m.content })),
        signal: controller.signal,
        onToken: (token) => {
          accumulatedText += token;
          setStreamingText((prev) => prev + token);
        },
        onToolCall: (callData) => {
          setActiveTool({
            status: "calling",
            name: callData.name,
            input: callData.input
          });
        },
        onToolExecuting: (execData) => {
          setActiveTool((prev) => ({
            ...(prev || {}),
            status: "executing",
            name: execData.name,
            input: execData.input
          }));
        },
        onToolResult: (resultData) => {
          finalToolResult = {
            status: resultData.status,
            name: resultData.name,
            input: resultData.input,
            result: resultData.result,
            error: resultData.error
          };
          setActiveTool(finalToolResult);
        },
        onDone: (doneData = {}) => {
          finalSuggestedActions = doneData?.suggestedActions || [];
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant_${Date.now()}`,
              role: "assistant",
              content: accumulatedText || doneData?.reply || "Done.",
              tool: finalToolResult,
              suggestedActions: finalSuggestedActions
            }
          ]);
          setStreamingText("");
          setActiveTool(null);
          setLoading(false);
        },
        onError: (err) => {
          console.warn("[Assistant Stream Error]:", err.message);
          setMessages((prev) => [
            ...prev,
            {
              id: `error_${Date.now()}`,
              role: "assistant",
              content: "I encountered a connection interruption while generating this answer. You can retry with the button below or explore verified listings directly.",
              tool: null,
              isError: true,
              failedPrompt: text.trim()
            }
          ]);
          setStreamingText("");
          setActiveTool(null);
          setLoading(false);
        }
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            id: `error_${Date.now()}`,
            role: "assistant",
            content: "Network connection was interrupted. Click Retry to re-run your prompt.",
            tool: null,
            isError: true,
            failedPrompt: text.trim()
          }
        ]);
      }
      setStreamingText("");
      setActiveTool(null);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Auto-hides with smooth scale when open) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              aria-expanded={isOpen}
              aria-haspopup="dialog"
              aria-label="Open Renterty AI Rental Concierge"
              className="relative flex items-center justify-center p-3.5 sm:px-4 sm:py-3 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 text-white rounded-full border border-white/20 shadow-xl shadow-teal-500/25 backdrop-blur-md cursor-pointer group focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 animate-pulse" />
                </div>
                <span className="text-sm font-bold tracking-tight hidden sm:inline">AI Concierge</span>
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streaming Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Renterty AI Rental Assistant"
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-6 right-3 sm:right-6 w-[95vw] sm:w-[460px] h-[82vh] max-h-[660px] z-50 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Sparkles className="h-5 w-5 animate-spin text-teal-200" style={{ animationDuration: "8s" }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-tight flex items-center gap-1.5">
                    Renterty AI Concierge
                    <span className="text-[10px] bg-teal-400/25 px-2 py-0.5 rounded-full font-semibold border border-white/20">
                      Live Stream
                    </span>
                  </h4>
                  <p className="text-[11px] text-teal-100 flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping"></span>
                    Verified PropTech Tools Connected
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Assistant (Escape)"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages Body with Screen Reader Live Announcement */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              role="region"
              aria-live="polite"
              aria-atomic="false"
              aria-label="Streaming message transcript"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(20, 184, 166, 0.3) transparent"
              }}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-zinc-950/60 relative"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`flex space-x-2.5 max-w-[90%] ${
                      msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.role === "user"
                          ? "bg-teal-500 text-white shadow-xs"
                          : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                      }`}
                    >
                      {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-tr-none shadow-xs font-medium"
                          : msg.isError
                          ? "bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-500/20 rounded-tl-none"
                          : "bg-white dark:bg-zinc-850 text-slate-800 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-700/80 rounded-tl-none shadow-2xs"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <FormattedMessage text={msg.content} />
                      )}

                      {/* Generative UI Tool Output Card */}
                      {msg.tool && <GenerativeToolCard toolState={msg.tool} />}

                      {/* Targeted Retry Action for Failed Stream Turn (FE-08) */}
                      {msg.isError && msg.failedPrompt && (
                        <div className="mt-2.5 pt-2 border-t border-red-200 dark:border-red-900/50 flex items-center justify-between">
                          <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
                            Stream failed mid-response
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSend(msg.failedPrompt)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Retry Prompt</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggested Quick Prompt Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 pl-9">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          onClick={() => handleSend(action)}
                          aria-label={`Ask: ${action}`}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:border-teal-300 transition-all cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
                        >
                          ✨ {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Active Streaming Token Container (FE-06 Handoff) */}
              {loading && (
                <div className="flex flex-col items-start space-y-2">
                  <div className="flex space-x-2.5 max-w-[90%] flex-row">
                    <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>

                    <div className="p-3.5 bg-white dark:bg-zinc-850 text-slate-800 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-700/80 rounded-2xl rounded-tl-none shadow-2xs text-xs sm:text-sm leading-relaxed">
                      {/* Generative Tool in Progress */}
                      {activeTool && <GenerativeToolCard toolState={activeTool} />}

                      {/* Streamed Text with smooth cursor */}
                      {streamingText ? (
                        <p className="whitespace-pre-wrap">
                          {streamingText}
                          <span className="inline-block w-1.5 h-3.5 ml-1 bg-teal-500 animate-pulse align-middle" />
                        </p>
                      ) : (
                        /* Thinking Indicator Handoff */
                        <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 py-1">
                          <Sparkles className="h-3.5 w-3.5 animate-spin" />
                          <span className="text-xs font-semibold">Consulting Renterty AI Engine...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Floating Jump to Latest Button when scrolled up (FE-06) */}
            <AnimatePresence>
              {isScrolledUp && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsScrolledUp(false);
                      scrollToBottom("smooth");
                    }}
                    className="flex items-center space-x-1 px-3 py-1 bg-slate-900/90 dark:bg-zinc-800/90 text-white rounded-full text-xs font-bold shadow-lg border border-white/10 hover:bg-teal-600 transition cursor-pointer backdrop-blur-md"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                    <span>Jump to latest</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input & Control Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center space-x-2 relative"
            >
              <label htmlFor="ai-streaming-input" className="sr-only">
                Ask Renterty AI Concierge
              </label>

              <div className="relative flex-1 flex items-center">
                <input
                  id="ai-streaming-input"
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about properties, rent estimates, tours..."
                  disabled={loading}
                  aria-label="Ask about properties, rent estimates, tours"
                  className="w-full pl-3.5 pr-9 py-2.5 bg-slate-100 dark:bg-zinc-800 text-xs sm:text-sm text-slate-900 dark:text-white rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-60 transition"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                  <VoiceSearchButton
                    size="sm"
                    onResult={(transcript) => {
                      setInput(transcript);
                      handleSend(transcript);
                    }}
                  />
                </div>
              </div>

              {/* Dynamic Stop vs Send Button (FE-06 Stop Button Requirement) */}
              {loading ? (
                <button
                  type="button"
                  onClick={handleStop}
                  aria-label="Stop generating response"
                  className="px-3 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer shrink-0 shadow-xs active:scale-95"
                >
                  <StopCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="p-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-40 text-white rounded-xl transition cursor-pointer shrink-0 shadow-xs active:scale-95 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
