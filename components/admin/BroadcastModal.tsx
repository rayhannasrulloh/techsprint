import { useState } from "react";
import { Megaphone, X, Send } from "lucide-react";

export default function BroadcastModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  if (!isOpen) return null;

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);
    try {
      const res = await fetch("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: broadcastTitle, content: broadcastContent, is_pinned: isPinned, author: "Academic Team" }),
      });
      
      if (res.ok) {
        alert("Broadcast sent to all teams!");
        setBroadcastTitle(""); setBroadcastContent(""); setIsPinned(false);
        onClose();
      } else {
        alert("Failed to send broadcast");
      }
    } catch (err) { alert("Error sending broadcast"); } 
    finally { setIsBroadcasting(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0c122b] border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#080c1f]">
          <div>
            <h2 className="text-2xl font-light text-white flex items-center gap-2"><Megaphone className="w-6 h-6 text-purple-500" /> New Broadcast</h2>
            <p className="text-gray-400 text-sm mt-1">Send a global announcement to all teams.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSendBroadcast} className="p-6 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Announcement Title</label>
            <input required type="text" value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} placeholder="e.g. Checkpoint 2 is now open!" className="w-full bg-[#050814] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Message Content</label>
            <textarea required rows={5} value={broadcastContent} onChange={(e) => setBroadcastContent(e.target.value)} placeholder="Type your message here..." className="w-full bg-[#050814] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 focus:outline-none resize-none"></textarea>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pin-checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="w-4 h-4 accent-purple-500 bg-gray-800 border-gray-700 rounded" />
            <label htmlFor="pin-checkbox" className="text-sm font-light text-gray-300">Pin this announcement to the top</label>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={isBroadcasting} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition-all disabled:opacity-50">
              {isBroadcasting ? "Sending..." : "Send Broadcast"} <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}