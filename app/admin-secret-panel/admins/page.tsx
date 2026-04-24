"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Search, Database, UserCheck, UserX, Trash2, Mail
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManageAdminsPage() {
  const [adminsData, setAdminsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatusTab, setActiveStatusTab] = useState("All");

  const fetchAdmins = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setAdminsData(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleUpdateAdminStatus = async (adminId: string, newStatus: string) => {
    if (!window.confirm(`Mark this admin as ${newStatus.toUpperCase()}?`)) return;
    try {
      const { error } = await supabase.from('admin_profiles').update({ status: newStatus }).eq('id', adminId);
      if (error) throw error;
      await fetchAdmins();
      toast.success(`Admin marked as ${newStatus}`);
    } catch (err: any) { alert("Error updating admin status: " + err.message); }
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (window.prompt(`DANGER: Type "${adminName}" to confirm deletion.`) !== adminName) return;
    try {
      const { error } = await supabase.from('admin_profiles').delete().eq('id', adminId);
      if (error) throw error;
      await fetchAdmins();
      toast.success("Admin deleted");
    } catch (err: any) { alert(`Error: ${err.message}`); }
  };

  const filteredAdmins = adminsData.filter(a => {
    const matchSearch = (a.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = activeStatusTab === "All" || (a.status || "").toLowerCase() === activeStatusTab.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-[90rem] mx-auto animate-in fade-in duration-500">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 p-6 gap-4">
        <div>
          <h1 className="text-3xl font-medium flex items-center gap-3">Admins Data</h1>
          <p className="text-sm text-gray-400 mt-1">Review and approve access requests for committee members.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
            />
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#1c1c1c] p-4 border-b border-white/10">
        <div className="flex flex-col gap-1.5 w-full md:w-1/2">
          <label className="text-xs text-gray-400 font-medium tracking-wider">Status</label>
          <select
            value={activeStatusTab}
            onChange={(e) => setActiveStatusTab(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
          >
            {["All", "Approved", "Pending", "Rejected"].map((tab) => (
              <option key={tab} value={tab}>{tab}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-[#1c1c1c] border border-white/10 overflow-hidden shadow-sm overflow-x-auto relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c]/80 z-10 backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-400 text-sm animate-pulse">Loading data...</p>
          </div>
        ) : null}

        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-white/5 text-center tracking-widest text-gray-400 border-b border-white/10">
              <th className="p-5 font-medium w-12">No.</th>
              <th className="p-5 font-medium">Admin Info</th>
              <th className="p-5 font-medium">Status</th>
              <th className="p-5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin, index) => (
                <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 border-r border-white/10 text-center text-gray-400 font-medium">{index + 1}</td>
                  <td className="p-4 border-r border-white/10">
                    <div className="flex flex-col gap-1">
                      <div className="text-lg font-medium text-white">{admin.full_name}</div>
                      <div className="text-sm text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {admin.email}</div>
                    </div>
                  </td>
                  <td className="p-5 border-r border-white/10 text-center">
                    <span className={`inline-flex items-center text-xs px-3 py-1.5 rounded-md border border-white/10 justify-center w-32 ${admin.status === 'approved' ? 'text-emerald-400 bg-emerald-400/10' : admin.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {admin.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-2">
                      {admin.status !== 'approved' && <button onClick={() => handleUpdateAdminStatus(admin.id, 'approved')} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20" title="Approve"><UserCheck className="w-5 h-5" /></button>}
                      {admin.status !== 'rejected' && <button onClick={() => handleUpdateAdminStatus(admin.id, 'rejected')} className="p-2 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20" title="Reject"><UserX className="w-5 h-5" /></button>}
                      <button onClick={() => handleDeleteAdmin(admin.id, admin.full_name)} className="p-2 bg-red-500/10 text-red-500 rounded-lg ml-2 hover:bg-red-500/20" title="Delete"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-16 text-center text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No Admins Found</p>
                  <p className="text-sm mt-1 font-light">
                    No matching admins with <strong className="text-white">{activeStatusTab}</strong> status.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
