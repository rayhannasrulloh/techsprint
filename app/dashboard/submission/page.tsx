"use client";

import { UploadCloud, Lock } from "lucide-react";

export default function SubmissionPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-1 text-gray-100">Final Submission</h1>
        <p className="text-gray-400 font-light text-sm">The finish line. Submit your final project here.</p>
      </div>

      <div className="max-w-3xl bg-[#0c122b] border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        
        {/* Lock Overlay Content */}
        <div className="absolute inset-0 bg-[#050814]/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
           <div className="bg-gray-800/50 p-4 rounded-2xl mb-4 border border-white/5">
             <Lock className="w-8 h-8 text-gray-400" />
           </div>
           <h2 className="text-xl font-normal text-gray-200 mb-2">Submissions are currently closed</h2>
           <p className="text-sm font-light text-gray-500 bg-black/40 px-4 py-2 rounded-full border border-white/5">
             Will open on Saturday at 08:00 AM
           </p>
        </div>

        {/* Background Forms (Blurred out) */}
        <div className="space-y-6 opacity-20 pointer-events-none">
          <div>
             <label className="block text-xs font-semibold tracking-widest text-gray-400 mb-2">FINAL GITHUB REPO</label>
             <input disabled type="text" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl p-4" />
          </div>
          <div>
             <label className="block text-xs font-semibold tracking-widest text-gray-400 mb-2">DEMO VIDEO LINK</label>
             <input disabled type="text" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl p-4" />
          </div>
          <div className="pt-4">
             <div className="w-full py-4 rounded-xl bg-blue-600/50 text-transparent">Submit</div>
          </div>
        </div>

      </div>
    </div>
  );
}