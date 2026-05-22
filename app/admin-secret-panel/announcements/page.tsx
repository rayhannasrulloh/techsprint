// File: src/app/admin-secret-panel/announcements/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Megaphone, Send, Edit2, Trash2, Pin, X } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  
  // Form State
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  
  // Logic State
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Ambil Data Pengumuman
  const fetchAnnouncements = async () => {
    setIsLoadingList(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setAnnouncements(data);
    setIsLoadingList(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Handle Form Submit (CREATE / UPDATE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);
    const actionName = editId ? "Updating" : "Broadcasting";
    const toastId = toast.loading(`${actionName} announcement...`);

    try {
      const url = "/api/admin/announcement";
      const method = editId ? "PATCH" : "POST";
      const body = editId 
        ? { id: editId, title: broadcastTitle, content: broadcastContent, is_pinned: isPinned }
        : { title: broadcastTitle, content: broadcastContent, is_pinned: isPinned, author: "Academic Team" };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (res.ok) {
        toast.success(`Announcement ${editId ? "updated" : "sent"} successfully!`, { id: toastId });
        handleCancelEdit(); // Bersihkan form
        fetchAnnouncements(); // Refresh daftar
      } else {
        toast.error("Failed to process request.", { id: toastId });
      }
    } catch (err) { 
      toast.error("Network error.", { id: toastId }); 
    } finally { 
      setIsBroadcasting(false); 
    }
  };

  // Handle Delete
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    const toastId = toast.loading("Deleting announcement...");
    try {
      const res = await fetch("/api/admin/announcement", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      if (res.ok) {
        toast.success("Deleted successfully!", { id: toastId });
        fetchAnnouncements();
      } else {
        toast.error("Failed to delete.", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error.", { id: toastId });
    }
  };

  // Masuk ke Mode Edit
  const handleEditClick = (ann: any) => {
    setEditId(ann.id);
    setBroadcastTitle(ann.title);
    setBroadcastContent(ann.content);
    setIsPinned(ann.is_pinned);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke form otomatis
  };

  // Batal Edit
  const handleCancelEdit = () => {
    setEditId(null);
    setBroadcastTitle("");
    setBroadcastContent("");
    setIsPinned(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">Announcements</h1>
        <p className="text-sm text-gray-400/80 mt-1.5 font-light tracking-wide">Manage global updates sent to all participant dashboards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* --- KIRI: FORM CREATE/EDIT --- */}
        <div className="lg:col-span-2">
          <div className={`bg-[#111827] border ${editId ? 'border-yellow-500' : 'border-[#1F2937]'} rounded-2xl p-6 relative overflow-hidden transition-colors duration-300`}>
            {editId ? (
              <div className="mb-6 flex items-center justify-between border-b border-yellow-500/20 pb-4">
                <h3 className="text-yellow-400 font-medium flex items-center gap-2"><Edit2 className="w-4 h-4"/> Edit Mode</h3>
                <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white p-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors"><X className="w-4 h-4"/></button>
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Announcement Title</label>
                <input required type="text" value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} placeholder="e.g. Checkpoint 2 is now open!" className="w-full bg-[#1F2937] border border-[#374151] rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Message Content</label>
                <textarea required rows={6} value={broadcastContent} onChange={(e) => setBroadcastContent(e.target.value)} placeholder="Type your message here..." className="w-full bg-[#1F2937] border border-[#374151] rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none transition-colors"></textarea>
              </div>

              <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => setIsPinned(!isPinned)}>
                <input type="checkbox" checked={isPinned} onChange={() => {}} className="w-4 h-4 accent-blue-500 border-white/5 rounded cursor-pointer pointer-events-none" />
                <label className="text-sm font-medium text-gray-300 cursor-pointer select-none">Pin to top of feed</label>
              </div>

              <button type="submit" disabled={isBroadcasting} className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 mt-4 ${editId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isBroadcasting ? "Processing..." : editId ? "Update Announcement" : "Publish Announcement"} {!isBroadcasting && <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* --- KANAN: DAFTAR PENGUMUMAN --- */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="font-medium">Published Announcements</h3>
          
          {isLoadingList ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
          ) : announcements.length === 0 ? (
            <div className="bg-[#111827] border border-[#1F2937] border-dashed rounded-2xl p-12 text-center text-gray-500">No announcements published yet.</div>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} className={`bg-[#111827] border rounded-2xl p-5 hover:bg-[#1F2937]/50 transition-colors ${ann.is_pinned ? 'border-blue-500' : 'border-[#1F2937]'}`}>
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-start">
                    <div className="mt-1">{ann.is_pinned ? <Pin className="w-4 h-4 text-white" /> : <Megaphone className="w-4 h-4 text-blue-500" />}</div>
                    <div>
                      <h4 className="font-medium text-gray-100 flex items-center gap-2">
                        {ann.title}
                        {ann.is_pinned && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Pinned</span>}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{new Date(ann.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons (Edit & Delete) */}
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEditClick(ann)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#1F2937] rounded-md transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(ann.id, ann.title)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#1F2937] rounded-md transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pl-7">
                  <p className="text-sm text-gray-300 font-normal leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}