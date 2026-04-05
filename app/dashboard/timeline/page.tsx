// File: src/app/dashboard/timeline/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Flag, CheckCircle2, Clock, Map } from "lucide-react";

// 🕒 KONFIGURASI WAKTU HACKATHON (WIB)
const START_TIME = new Date("2026-05-09T12:00:00+07:00").getTime();
const CP1_DEADLINE = new Date("2026-05-09T18:00:00+07:00").getTime();
const CP2_DEADLINE = new Date("2026-05-10T00:00:00+07:00").getTime();
const CP3_DEADLINE = new Date("2026-05-10T06:00:00+07:00").getTime();
const FINAL_DEADLINE = new Date("2026-05-10T12:00:00+07:00").getTime();

export default function TimelinePage() {
  const [now, setNow] = useState<number>(new Date().getTime());

  // Update clock every second
  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // --- LOGIKA REAL-TIME ROADMAP ---
  let currentPhaseIndex = -1;
  if (now > FINAL_DEADLINE) {
    currentPhaseIndex = 5;
  } else if (now > CP3_DEADLINE) {
    currentPhaseIndex = 4;
  } else if (now > CP2_DEADLINE) {
    currentPhaseIndex = 3;
  } else if (now > CP1_DEADLINE) {
    currentPhaseIndex = 2;
  } else if (now > START_TIME) {
    currentPhaseIndex = 1;
  } else {
    currentPhaseIndex = 0;
  }

  // Data Visual Roadmap
  const roadmapSteps = [
    { title: "Hackathon Starts", time: "09 May, 12:00 WIB", desc: "The 24h sprint begins.", idx: 0 },
    { title: "Checkpoint 1", time: "09 May, 18:00 WIB", desc: "Initial progress", idx: 1 },
    { title: "Checkpoint 2", time: "10 May, 00:00 WIB", desc: "Midnight check-in", idx: 2 },
    { title: "Checkpoint 3", time: "10 May, 06:00 WIB", desc: "Morning sprint", idx: 3 },
    { title: "Final Submission", time: "10 May, 12:00 WIB", desc: "Times up!", idx: 4 },
  ];

  return (
    <div className="animate-in fade-in duration-500">

      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-wide mb-1 text-gray-100 flex items-center gap-3">
          Event Timeline
        </h1>
        <p className="text-gray-400 font-light text-sm">Track your sprint progress and upcoming deadlines.</p>
      </div>

      <div className="bg-[#0c122b] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="flex items-center gap-2 mb-12 relative z-10">
          <h3 className="text-sm font text-gray-300 tracking-widest">24-Hour Roadmap</h3>
        </div>

        {/* Horizontal Roadmap (Adapted for full page width) */}
        <div className="relative w-full flex justify-between items-center px-4 pb-12 overflow-x-auto min-w-[700px] z-10">

          {/* Garis Dasar (Background) */}
          <div className="absolute left-10 right-10 top-5 h-1.5 bg-gray-800 rounded-full"></div>

          {/* Garis Progress Aktif */}
          <div
            className="absolute left-10 top-5 h-1.5 bg-gradient-to-r from-emerald-700 to-blue-400 transition-all duration-1000 rounded-full"
            style={{ width: `${Math.min((currentPhaseIndex / 4) * 100, 100)}%` }}
          ></div>

          {roadmapSteps.map((step) => {
            const isPast = currentPhaseIndex > step.idx;
            const isCurrent = currentPhaseIndex === step.idx;

            return (
              <div key={step.idx} className="relative z-10 flex flex-col items-center gap-4 w-32 group">
                {/* Node Status Indicator */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isPast ? 'bg-[#0c122b] border-emerald-700 text-white' : isCurrent ? 'bg-[#0c122b] border-blue-400 text-blue-400' : 'bg-[#050814] border-gray-700 text-gray-600'}`}>
                  {isPast ? <CheckCircle2 className="w-6 h-6 text-emerald-700" /> : isCurrent ? <Clock className="w-5 h-5 animate-pulse" /> : <span className="text-sm font-bold">{step.idx === 4 ? 'E' : step.idx}</span>}
                </div>

                {/* Text Details */}
                <div className="text-center mt-2">
                  <p className={`text-sm tracking-wide mb-1 ${isCurrent ? 'text-blue-400' : isPast ? 'text-emerald-700' : 'text-gray-400'}`}>{step.title}</p>
                  <p className="text-[11px] text-gray-500 font-medium bg-white/5 inline-block px-2 py-1 rounded-md mb-2">{step.time}</p>
                  <p className="text-[10px] text-gray-600 font-light leading-relaxed px-2">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  );
}
// Output: Renders a dedicated Event Timeline page with a real-time horizontal progress bar and descriptive nodes for each sprint phase.