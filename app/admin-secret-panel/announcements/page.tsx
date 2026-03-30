// File: src/app/admin-secret-panel/announcements/page.tsx
"use client";

import { useState } from "react";
import { Megaphone, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function AnnouncementsPage() {
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);
    const toastId = toast.loading("Broadcasting to all teams...");

    try {
      const res = await fetch("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: broadcastTitle, content: broadcastContent, is_pinned: isPinned, author: "Academic Team" }),
      });
      
      if (res.ok) {
        toast.success("Broadcast sent successfully!", { id: toastId });
        setBroadcastTitle(""); setBroadcastContent(""); setIsPinned(false);
      } else {
        toast.error("Failed to send broadcast.", { id: toastId });
      }
    } catch (err) { toast.error("Network error.", { id: toastId }); } 
    finally { setIsBroadcasting(false); }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-light flex items-center gap-3"><Megaphone className="text-purple-500" /> Announcements</h1>
        <p className="text-gray-400 text-sm mt-1">Send global updates to all participant dashboards.</p>
      </div>

      <div className="bg-[#0c122b] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <form onSubmit={handleSendBroadcast} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Announcement Title</label>
            <input required type="text" value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} placeholder="e.g. Checkpoint 2 is now open!" className="w-full bg-[#050814] border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none" />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Message Content</label>
            <textarea required rows={6} value={broadcastContent} onChange={(e) => setBroadcastContent(e.target.value)} placeholder="Type your message here..." className="w-full bg-[#050814] border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none resize-none"></textarea>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <input type="checkbox" id="pin-checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="w-5 h-5 accent-purple-500 bg-gray-800 border-gray-700 rounded cursor-pointer" />
            <label htmlFor="pin-checkbox" className="text-sm font-medium text-gray-300 cursor-pointer">Pin this announcement to the top of the dashboard feed</label>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={isBroadcasting} className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] disabled:opacity-50">
              {isBroadcasting ? "Sending Broadcast..." : "Publish Announcement"} <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}