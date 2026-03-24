"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lock scroll while loading
    document.body.style.overflow = "hidden";
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Restore scroll
      document.body.style.overflow = "unset";
    }, 2500); // 2.5 seconds loading intro
    
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
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050814] overflow-hidden"
        >
          {/* Subtle background glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-10"
          >
            <img 
              src="/logo-techsprint-2026.png" 
              alt="3IN1 Tech Sprint" 
              className="w-48 md:w-64 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} 
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} 
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-2.5 h-2.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"
                />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} 
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                />
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-gray-400 font-light tracking-[0.3em] uppercase text-[10px] md:text-xs"
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
