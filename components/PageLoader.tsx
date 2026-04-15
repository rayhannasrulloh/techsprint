"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lock scroll while loading
    document.body.style.overflow = "hidden";
    
    const isMobileView = window.innerWidth < 768;
    const timeoutDuration = isMobileView ? 0 : 800; // Skip loader on mobile to fix LCP
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Restore scroll
      document.body.style.overflow = "unset";
    }, timeoutDuration);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050814] overflow-hidden"
        >
          {/* Subtle background glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-8"
          >
            {/* Mascot container */}
            <div className="relative flex items-center justify-center">

              {/* Pulsing glow ring behind mascot */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-blue-500/20 blur-2xl pointer-events-none"
              />
              <motion.div
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute w-36 h-36 md:w-52 md:h-52 rounded-full bg-cyan-400/15 blur-xl pointer-events-none"
              />

              {/* Twinkling star particles */}
              {[
                { top: "8%",  left: "10%", delay: 0,    size: "text-lg", color: "text-blue-300" },
                { top: "15%", right: "8%", delay: 0.6,  size: "text-sm", color: "text-cyan-400" },
                { top: "55%", left: "5%",  delay: 1.1,  size: "text-base",color: "text-blue-400" },
                { top: "70%", right: "4%", delay: 0.3,  size: "text-lg", color: "text-cyan-300" },
                { top: "40%", left: "0%",  delay: 1.5,  size: "text-xs", color: "text-white/60" },
                { top: "30%", right: "0%", delay: 0.9,  size: "text-xs", color: "text-blue-200" },
              ].map((s, i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
                  transition={{ duration: 1.8 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
                  className={`absolute select-none pointer-events-none ${s.size} ${s.color}`}
                  style={{ top: s.top, left: (s as any).left, right: (s as any).right }}
                >
                  ✦
                </motion.span>
              ))}

              {/* Mascot image — float + gentle rock */}
              <motion.div
                animate={{
                  y: [0, -14, 0],
                  rotate: [-1, 1, -1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.img
                  src="/mascot/Stand.webp"
                  alt="Mr. Sprint — Mascot of Tech Sprint 2026"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  className="w-40 md:w-56 h-auto object-contain relative z-10 select-none drop-shadow-[0_0_24px_rgba(59,130,246,0.5)]"
                  draggable={false}
                />
              </motion.div>
            </div>

            {/* Text + dots */}
            <div className="flex flex-col items-center gap-4">
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-white font-semibold tracking-widest text-sm md:text-base"
              >
              </motion.p>

              <div className="flex items-center gap-2">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay }}
                    className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] ${
                      i === 0 ? "bg-blue-500" : i === 1 ? "bg-blue-400" : "bg-cyan-400"
                    }`}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-500 font-light tracking-[0.3em] uppercase text-[10px] md:text-xs"
              >
                Initializing System
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
