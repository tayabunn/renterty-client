"use client";

import React, { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export function TypingAnimation({
  words = [],
  text = "",
  children,
  loop = true,
  typingSpeed = 100,
  deletingSpeed = 50,
  delay = 1500,
  className,
  as: Component = "span",
}) {
  const resolvedWords = useMemo(() => {
    if (Array.isArray(words) && words.length > 0) return words;
    if (text) return [text];
    if (typeof children === "string") return [children];
    return [];
  }, [words, text, children]);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (resolvedWords.length === 0) return;

    const currentWord = resolvedWords[currentWordIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) => currentWord.slice(0, prev.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && currentText === currentWord) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, delay);
    }

    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      if (loop || currentWordIndex < resolvedWords.length - 1) {
        setCurrentWordIndex((prev) => (prev + 1) % resolvedWords.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, resolvedWords, loop, typingSpeed, deletingSpeed, delay]);

  if (resolvedWords.length === 0) return null;

  return (
    <Component className={cn("inline-block", className)}>
      {currentText}
      <span className="animate-pulse ml-0.5 font-normal">|</span>
    </Component>
  );
}
