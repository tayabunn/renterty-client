"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, MessageSquare, X, Send, Bot, User, Building, ArrowRight, Loader2, StopCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { aiAssistantMessage } from "../../lib/ai";
import Link from "next/link";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your Renterty Rental Assistant. Ask me anything about finding properties, comparing prices, checking your favorites, or understanding rental requirements!",
      properties: [],
      suggestedActions: [
        "Show cheapest apartments",
        "How do I book a rental?",
        "Show my saved favorites",
        "Find 2 bedroom flats in Uttara"
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [messages, isOpen]);

  // Keyboard accessibility: Close dialog on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleStop = () => {
    if (loading) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Response stopped by user.",
          properties: [],
          suggestedActions: ["Show cheapest apartments", "How do I book a rental?"]
        }
      ]);
    }
  };

  const handleSend = async (messageText) => {
    const text = messageText || input;
    if (!text.trim() || loading) return;

    const userMessage = { role: "user", content: text };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await aiAssistantMessage(
        text,
        updatedHistory.map((m) => ({ role: m.role, content: m.content }))
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.reply,
          properties: response.properties || [],
          suggestedActions: response.suggestedActions || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I encountered an issue processing that. Please feel free to ask again or browse our properties catalog!",
          properties: [],
          suggestedActions: ["Browse All Properties", "Show cheapest apartments"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Toggle Renterty AI Rental Assistant Concierge"
          className="relative flex items-center space-x-2 px-4 py-3.5 bg-linear-to-r from-teal-500 via-emerald-500 to-teal-600 text-white rounded-full border border-white/20 backdrop-blur-md cursor-pointer group focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          <div className="p-1 bg-white/20 rounded-full">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <span className="text-sm font-bold tracking-tight hidden sm:inline">Ask AI</span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
          </span>
        </motion.button>
      </div>

      {/* Assistant Accessible Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Renterty AI Rental Assistant Concierge"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-22 right-4 sm:right-6 w-[94vw] sm:w-[420px] max-h-[600px] h-[75vh] z-50 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-linear-to-r from-teal-500 to-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-tight">Renterty AI Concierge</h4>
                  <p className="text-[11px] text-teal-100 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300"></span> Online & Ready to help
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Assistant (Press Escape)"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages Body with Screen Reader Live Announcement */}
            <div
              role="region"
              aria-live="polite"
              aria-atomic="false"
              aria-label="Chat messages history"
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-zinc-950/50"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`flex space-x-2 max-w-[85%] ${
                      msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.role === "user"
                          ? "bg-teal-500 text-white"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-teal-600 text-white rounded-tr-none"
                          : "bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-700/80 rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {/* Property Cards Embedded in Assistant Response */}
                      {msg.properties && msg.properties.length > 0 && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-700">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 block">
                            Matching Listings:
                          </span>
                          {msg.properties.map((prop) => (
                            <Link
                              key={prop._id}
                              href={`/properties/${prop._id}`}
                              onClick={() => setIsOpen(false)}
                              aria-label={`View property details for ${prop.title} in ${prop.location}`}
                              className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 hover:border-teal-500/50 transition-colors group block focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
                            >
                              <div className="h-10 w-12 rounded-lg bg-slate-200 dark:bg-zinc-800 overflow-hidden shrink-0">
                                {prop.images && prop.images[0] ? (
                                  <img
                                    src={prop.images[0]}
                                    alt={`${prop.title} in ${prop.location}`}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Building className="h-5 w-5 m-auto text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600">
                                  {prop.title}
                                </h5>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                                  📍 {prop.location} • ${prop.rent?.toLocaleString()}/{prop.rentType || "mo"}
                                </p>
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-500 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggested Quick Prompt Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && index === messages.length - 1 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 pl-9">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          onClick={() => handleSend(action)}
                          aria-label={`Ask: ${action}`}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 hover:bg-teal-100 hover:border-teal-300 transition-colors cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
                        >
                          ✨ {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 pl-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-none border border-slate-200/80 dark:border-zinc-700 flex items-center space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce delay-150"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce delay-300"></span>
                    <button
                      type="button"
                      onClick={handleStop}
                      aria-label="Stop AI generation"
                      className="ml-2 text-[10px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-0.5"
                    >
                      <StopCircle className="h-3 w-3" /> Stop
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center space-x-2"
            >
              <label htmlFor="ai-chat-input" className="sr-only">
                Type your question for the AI Rental Assistant
              </label>
              <input
                id="ai-chat-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about properties, pricing, bookings..."
                aria-label="Ask about properties, pricing, bookings"
                className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-zinc-800 text-xs sm:text-sm text-slate-900 dark:text-white rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="p-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
