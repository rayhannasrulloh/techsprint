"use client";

import { Megaphone, Pin, Clock, Activity } from "lucide-react";

export default function AnnouncementsPage() {
  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Greeting Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-wide mb-1 text-gray-100">Welcome back, Team!</h1>
        <p className="text-gray-400 font-light text-sm">Last update: {new Date().toLocaleDateString()} | 48 Hours Remaining</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-medium bg-white/5 px-2 py-1 rounded-full text-gray-400">Status</span>
          </div>
          <div>
            <h3 className="text-3xl font-normal text-white mb-1">On Track</h3>
            <p className="text-sm font-light text-gray-500">Your team is registered and ready.</p>
          </div>
        </div>

        <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-medium bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">Next Deadline</span>
          </div>
          <div>
            <h3 className="text-3xl font-normal text-white mb-1">16:00</h3>
            <p className="text-sm font-light text-gray-500">Checkpoint 1 Submission</p>
          </div>
        </div>
      </div>

      {/* Announcements Feed */}
      <h2 className="text-lg font-light text-gray-300 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        
        {/* Pinned Card */}
        <div className="bg-gradient-to-r from-blue-900/20 to-[#0c122b] border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden flex gap-4">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="mt-1"><Pin className="w-5 h-5 text-blue-400" /></div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-base font-normal text-blue-100">Welcome to 3IN1 Tech Sprint 2026!</h3>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Pinned</span>
            </div>
            <p className="text-gray-400 font-light text-sm leading-relaxed mb-2">
              The hackathon has officially started. Make sure your team joins the Discord server to communicate with mentors and check the timeline.
            </p>
            <p className="text-xs text-gray-500 font-light">Posted by Academic Team • 2 hours ago</p>
          </div>
        </div>

        {/* Regular Card */}
        <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-6 flex gap-4 hover:bg-white/[0.03] transition-colors">
          <div className="mt-1"><Megaphone className="w-5 h-5 text-gray-500" /></div>
          <div>
            <h3 className="text-base font-normal text-gray-200 mb-1">Checkpoint 1 is Opening Soon</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed mb-2">
              Get your repositories ready! Checkpoint 1 submission will open in 2 hours.
            </p>
            <p className="text-xs text-gray-500 font-light">12 March 2026 • 10:00 AM</p>
          </div>
        </div>

      </div>
    </div>
  );
}