"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface TypewriterProps {
  text: string | string[];
  className?: string;
  delay?: number;
  speed?: number;
  pauseBetween?: number;
}

export function Typewriter({ 
  text, 
  className = "", 
  delay = 0, 
  speed = 0.05,
  pauseBetween = 1500 
}: TypewriterProps) {
  const texts = Array.isArray(text) ? text : [text];
  const [textIndex, setTextIndex] = useState(0);

  const currentString = texts[textIndex];
  const characters = currentString.split("");

  const isLast = textIndex === texts.length - 1;

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: speed,
        delayChildren: textIndex === 0 ? delay : 0,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, display: "none" },
    visible: {
      opacity: 1,
      display: "inline",
    },
  };

  const handleAnimationComplete = (definition: any) => {
    if (definition === "visible" && !isLast) {
      setTimeout(() => {
        setTextIndex(prev => prev + 1);
      }, pauseBetween);
    }
  };

  return (
    <motion.span
      key={textIndex}
      variants={container}
      initial="hidden"
      animate="visible"
      onAnimationComplete={handleAnimationComplete}
      className={className}
    >
      {characters.map((char, index) => (
        <motion.span variants={child} key={index}>
          {char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block translate-y-[0.1em] ml-[2px] w-[0.4em] h-[0.9em] bg-blue-400"
      />
    </motion.span>
  );
}
