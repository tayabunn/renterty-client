"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlurInText component split and animates letters or words with a blur-in effect.
 * Triggers when scrolled into view or immediately on mount.
 */
export function BlurInText({
  text = "",
  blurAmount = 10,
  duration = 1.2,
  stagger = 0.06,
  split = "letter",
  trigger = "inView",
}) {
  if (!text) return null;

  // Split text by letter or word
  const elements = split === "letter" ? text.split("") : text.split(" ");

  // Stagger container animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  // Individual letter/word animation
  const itemVariants = {
    hidden: {
      filter: `blur(${blurAmount}px)`,
      opacity: 0,
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      transition: {
        duration: duration,
        ease: [0.22, 1, 0.36, 1], // easeOutQuart for premium smooth motion
      },
    },
  };

  const isScrollTrigger = trigger === "inView";

  return (
    <motion.span
      className="inline-block"
      variants={containerVariants}
      initial="hidden"
      animate={isScrollTrigger ? undefined : "visible"}
      whileInView={isScrollTrigger ? "visible" : undefined}
      viewport={isScrollTrigger ? { once: true, margin: "-10%" } : undefined}
    >
      {elements.map((item, idx) => {
        // Render whitespace properly for character splits
        const displayItem = split === "letter" && item === " " ? "\u00A0" : item;

        return (
          <motion.span
            key={idx}
            className="inline-block"
            variants={itemVariants}
          >
            {displayItem}
            {split === "word" && idx < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
