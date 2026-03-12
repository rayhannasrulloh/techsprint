// File: src/app/dashboard/timeline/page.tsx
"use client";

import { CheckCircle2, CircleDashed } from "lucide-react";

export default function TimelinePage() {
  const roadmap = [
    { title: "Opening Ceremony & Briefing", time: "Friday, 08:00 AM", status: "completed" },
    { title: "Hacking Begins!", time: "Friday, 12:00 PM", status: "completed" },
    { title: "Checkpoint 1 Submission", time: "Friday, 06:00 PM", status: "active" },
    { title: "Checkpoint 2 Submission", time: "Saturday, 12:00 AM", status: "pending" },
    { title: "Checkpoint 3 Submission", time: "Saturday, 06:00 AM", status: "pending" },
    { title: "Final Submission Closed", time: "Saturday, 12:00 PM", status: "pending" },
    { title: "Pitching & Judging", time: "Saturday, 12:30 PM", status: "pending" },
    { title: "Awarding Night", time: "Saturday, 04:00 PM", status: "pending" },
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-light tracking-wide mb-2 text-gray-100">Timeline & Roadmap</h1>
      <p className="text-gray-400 mb-10 font-light text-sm">Keep track of your 24-hour journey.</p>

      <div className="relative border-l border-white/10 ml-4 space-y-8 pb-8">
        {roadmap.map((item, idx) => (
          <div key={idx} className="relative pl-8">
            <span className="absolute -left-3 top-1 bg-[#050814] p-1">
              {item.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : item.status === "active" ? (
                <CircleDashed className="w-5 h-5 text-blue-500 animate-spin-slow" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-gray-600 bg-[#0a0f24]"></div>
              )}
            </span>
            <h3 className={`text-lg font-normal ${item.status === "active" ? "text-blue-400" : "text-gray-200"}`}>
              {item.title}
            </h3>
            <p className="text-sm font-light text-gray-500 mt-1">{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
// Output: Renders a vertical roadmap visualizing the event schedule and current progress.