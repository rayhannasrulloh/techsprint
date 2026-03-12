"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ShieldAlert, Search, Database, CheckCircle2, XCircle, 
  Trash2, UserCheck, UserX, AlertTriangle 
} from "lucide-react";

// 🔒 GANTI DENGAN EMAIL PANITIA & JURI
const ADMIN_EMAILS = ["rayhan.nasrulloh@student.president.ac.id", "admin@techsprint.web.id"];

export default function AdminPanelPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All"); // Tabs: All, UI/UX, Data Automation, System Analyst

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select(`id, team_name, track, status, created_at`)
      .order('created_at', { ascending: false });

    if (!error && data) setTeamsData(data);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !ADMIN_EMAILS.includes(session.user.email || "")) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      setIsAdmin(true);
      await fetchTeams();
      setIsLoading(false);
    };
    checkAdmin();
  }, [router]);

  // ACTION: Mengubah Status (Approve/Reject)
  const handleUpdateStatus = async (teamId: string, newStatus: string) => {
    if (!window.confirm(`Are you sure you want to mark this team as ${newStatus.toUpperCase()}?`)) return;
    
    try {
      const res = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, status: newStatus }),
      });
      if (res.ok) await fetchTeams(); // Refresh data
    } catch (err) {
      alert("Error updating status");
    }
  };

  // ACTION: Hapus Tim secara Permanen
  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    const confirmDelete = window.prompt(`DANGER ZONE: Type "${teamName}" to confirm permanent deletion of this team and their account.`);
    if (confirmDelete !== teamName) return;

    try {
      const res = await fetch("/api/admin/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      if (res.ok) {
        alert("Team permanently deleted.");
        await fetchTeams(); // Refresh data
      }
    } catch (err) {
      alert("Error deleting team");
    }
  };

  // FILTERING LOGIC
  const filteredTeams = teamsData.filter(team => {
    const matchSearch = team.team_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === "All" || team.track === activeTab;
    return matchSearch && matchTab;
  });

  if (isLoading) return <div className="min-h-screen bg-[#050814] flex items-center justify-center text-blue-500">Loading Secure Data...</div>;
  
  if (!isAdmin) return (
    <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center text-white">
      <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050814] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-wide flex items-center gap-3">
              <Database className="text-blue-500" /> Participant Verification
            </h1>
            <p className="text-gray-400 text-sm mt-1">Total Registered Teams: {teamsData.length}</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search team..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c122b] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Track Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-2 border-b border-white/10">
          {["All", "UI/UX", "Data Automation", "System Analyst"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-t-lg font-light transition-all ${activeTab === tab ? "bg-blue-600/20 text-blue-400 border-b-2 border-blue-500" : "text-gray-400 hover:bg-white/5"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Teams Database Table */}
        <div className="bg-[#0c122b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-xs uppercase tracking-widest text-gray-400 border-b border-white/10">
                <th className="p-5 font-semibold">Team Name</th>
                <th className="p-5 font-semibold">Track Category</th>
                <th className="p-5 font-semibold">Registration Status</th>
                <th className="p-5 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                  
                  <td className="p-5 font-medium text-lg text-blue-100">{team.team_name}</td>
                  
                  <td className="p-5">
                    <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-md border border-gray-700">
                      {team.track}
                    </span>
                  </td>

                  <td className="p-5">
                    {team.status === 'approved' && <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full w-max"><CheckCircle2 className="w-3 h-3"/> Approved</span>}
                    {team.status === 'rejected' && <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-3 py-1.5 rounded-full w-max"><XCircle className="w-3 h-3"/> Rejected</span>}
                    {team.status === 'pending' && <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full w-max"><AlertTriangle className="w-3 h-3"/> Pending Review</span>}
                  </td>

                  <td className="p-5 flex justify-end gap-2">
                    {/* Approve Button */}
                    {team.status !== 'approved' && (
                      <button onClick={() => handleUpdateStatus(team.id, 'approved')} className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Approve Team">
                        <UserCheck className="w-5 h-5" />
                      </button>
                    )}
                    
                    {/* Reject Button */}
                    {team.status !== 'rejected' && (
                      <button onClick={() => handleUpdateStatus(team.id, 'rejected')} className="p-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-colors" title="Reject Team">
                        <UserX className="w-5 h-5" />
                      </button>
                    )}

                    {/* Delete Button (Danger) */}
                    <button onClick={() => handleDeleteTeam(team.id, team.team_name)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors ml-2" title="Permanently Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}