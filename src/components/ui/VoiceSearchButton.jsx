"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function VoiceSearchButton({
  onResult,
  className = "",
  size = "md", // "sm" | "md" | "lg"
  placeholder = "Speak now..."
}) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast("🎙️ Listening... Speak your search query", {
        icon: "✨",
        style: {
          borderRadius: "12px",
          background: "#09090b",
          color: "#fff",
          border: "1px solid #14b8a6"
        }
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && onResult) {
        onResult(transcript);
        toast.success(`Voice Recognized: "${transcript}"`);
      }
    };

    recognition.onerror = (event) => {
      console.warn("[Speech Recognition Event]:", event.error);
      setIsListening(false);
      if (event.error !== "no-speech" && event.error !== "aborted") {
        toast.error("Could not capture audio. Please try again or type.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [onResult]);

  const toggleListening = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!supported) {
      toast.error("Voice input is not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn("[Speech Start Error]:", err);
        recognitionRef.current?.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 100);
      }
    }
  };

  const sizeClasses = {
    sm: "p-1.5 h-7 w-7 text-xs",
    md: "p-2 h-9 w-9 text-sm",
    lg: "p-2.5 h-11 w-11 text-base"
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <div className="relative inline-flex items-center">
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleListening}
        aria-label={isListening ? "Stop listening" : "Start voice search"}
        title={isListening ? "Listening... click to stop" : "Search by voice (Groq Whisper Powered)"}
        className={`relative flex items-center justify-center rounded-xl transition-all cursor-pointer select-none ${
          sizeClasses[size] || sizeClasses.md
        } ${
          isListening
            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse"
            : "bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/20 hover:border-teal-500/40"
        } ${className}`}
      >
        {isListening ? (
          <>
            <Mic className={`${iconSizes[size] || iconSizes.md} animate-bounce`} />
            {/* Live Ripple Waves */}
            <span className="absolute -inset-1 rounded-xl bg-rose-500/30 animate-ping pointer-events-none" />
          </>
        ) : (
          <Mic className={iconSizes[size] || iconSizes.md} />
        )}
      </motion.button>
    </div>
  );
}
