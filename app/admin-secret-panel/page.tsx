// File: src/app/admin-secret-panel/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ShieldAlert, Search, Database, CheckCircle2, XCircle, 
  Trash2, UserCheck, UserX, AlertTriangle, Download, ExternalLink, Mail, User
} from "lucide-react";

// 🔒 GANTI DENGAN EMAIL PANITIA & JURI
const ADMIN_EMAILS = ["rayhan.nasrulloh@student.president.ac.id", "admin@techsprint.web.id"];

export default function AdminPanelPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        id, team_name, track, status, created_at, leader_name, leader_email,
        checkpoints ( checkpoint_number, github_link, report_text ),
        submissions ( final_repo_link, presentation_link )
      `)
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

  // ACTION: Update Status
  const handleUpdateStatus = async (teamId: string, newStatus: string) => {
    if (!window.confirm(`Mark this team as ${newStatus.toUpperCase()}?`)) return;
    try {
      const res = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, status: newStatus }),
      });
      if (res.ok) await fetchTeams();
    } catch (err) {
      alert("Error updating status");
    }
  };

  // ACTION: Delete Team
  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    const confirmDelete = window.prompt(`DANGER: Type "${teamName}" to confirm deletion.`);
    if (confirmDelete !== teamName) return;
    try {
      const res = await fetch("/api/admin/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      if (res.ok) {
        alert("Team deleted.");
        await fetchTeams();
      }
    } catch (err) {
      alert("Error deleting team");
    }
  };

  // EXPORT TO CSV
  const handleExportCSV = () => {
    const headers = ["Team Name", "Track Category", "Leader Name", "Leader Email", "Registration Status", "CP 1", "CP 2", "CP 3", "Final Repo", "Pitch Deck", "Registered At"];
    
    const csvData = filteredTeams.map(team => {
      const hasCP = (num: number) => team.checkpoints.some((cp: any) => cp.checkpoint_number === num) ? "Done" : "Pending";
      const finalSub = team.submissions && team.submissions.length > 0 ? team.submissions[0] : null;
      
      return [
        team.team_name,
        team.track,
        team.leader_name || "N/A",
        team.leader_email || "N/A",
        team.status,
        hasCP(1), hasCP(2), hasCP(3),
        finalSub?.final_repo_link || "Not Submitted",
        finalSub?.presentation_link || "Not Submitted",
        new Date(team.created_at).toLocaleString()
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(","); // Escape quotes
    });

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `3IN1_TechSprint_Teams_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTeams = teamsData.filter(team => {
    const matchSearch = team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (team.leader_email && team.leader_email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchTab = activeTab === "All" || team.track === activeTab;
    return matchSearch && matchTab;
  });

  // CALCULATE STATISTICS
  const totalTeams = teamsData.length;
  const approvedTeams = teamsData.filter(t => t.status === 'approved').length;
  const pendingTeams = teamsData.filter(t => t.status === 'pending').length;
  const rejectedTeams = teamsData.filter(t => t.status === 'rejected').length;
  
  // Track Breakdown
  const uiuxCount = teamsData.filter(t => t.track === 'UI/UX').length;
  const dataCount = teamsData.filter(t => t.track === 'Data Automation').length;
  const saCount = teamsData.filter(t => t.track === 'System Analyst').length;

  if (isLoading) return <div className="min-h-screen bg-[#050814] flex items-center justify-center text-blue-500">Loading Secure Data...</div>;
  if (!isAdmin) return <div className="min-h-screen bg-[#050814] flex items-center justify-center"><h1 className="text-4xl text-red-500">Access Denied</h1></div>;

  return (
    <div className="min-h-screen bg-[#050814] text-white p-8 font-sans">
      <div className="max-w-[90rem] mx-auto">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-wide flex items-center gap-3">
              <Database className="text-blue-500" /> Event Overview & Verifications
            </h1>
            <p className="text-gray-400 text-sm mt-1">Real-time statistics for 3IN1 Tech Sprint 2026</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search team or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0c122b] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-full hover:bg-emerald-600/40 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* --- STATISTIC DASHBOARD (NEW) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Total Teams Card */}
          <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-sm font-light text-gray-400 mb-1">Total Teams Registered</p>
            <h3 className="text-4xl font-normal text-white">{totalTeams}</h3>
            <p className="text-xs text-blue-400 mt-2">Est. {totalTeams * 3} Individual Participants</p>
          </div>

          {/* Verification Status Card */}
          <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-5">
            <p className="text-sm font-light text-gray-400 mb-3">Verification Status (RSVP)</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400"/> Approved</span>
              <span className="font-medium text-emerald-400">{approvedTeams}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-300 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-yellow-400"/> Pending</span>
              <span className="font-medium text-yellow-400">{pendingTeams}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mt-3 overflow-hidden flex">
              <div style={{ width: `${totalTeams === 0 ? 0 : (approvedTeams/totalTeams)*100}%` }} className="bg-emerald-500 h-full"></div>
              <div style={{ width: `${totalTeams === 0 ? 0 : (pendingTeams/totalTeams)*100}%` }} className="bg-yellow-500 h-full"></div>
            </div>
          </div>

          {/* Track Breakdown Card */}
          <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-5 lg:col-span-2">
            <p className="text-sm font-light text-gray-400 mb-3">Registrations by Track Category</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-2xl font-normal text-white">{uiuxCount}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">UI/UX Design</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-2xl font-normal text-white">{dataCount}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Data Automation</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-2xl font-normal text-white">{saCount}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">System Analyst</p>
              </div>
            </div>
          </div>

        </div>
        {/* --- END OF STATISTIC DASHBOARD --- */}


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

        {/* Main Table */}
        <div className="bg-[#0c122b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white/5 text-xs uppercase tracking-widest text-gray-400 border-b border-white/10">
                <th className="p-5 font-semibold">Team Info</th>
                <th className="p-5 font-semibold">Registration</th>
                <th className="p-5 font-semibold">Checkpoints Tracker</th>
                <th className="p-5 font-semibold">Final Submission</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTeams.map((team) => {
                const hasCP = (num: number) => team.checkpoints.some((cp: any) => cp.checkpoint_number === num);
                const getCPLink = (num: number) => team.checkpoints.find((cp: any) => cp.checkpoint_number === num)?.github_link;
                const finalSub = team.submissions && team.submissions.length > 0 ? team.submissions[0] : null;

                return (
                  <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Column 1: Team & Leader Info */}
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-lg text-blue-100">{team.team_name}</p>
                          <span className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-300 border border-gray-700 rounded-md">{team.track}</span>
                        </div>
                        <div className="text-sm font-light text-gray-400 flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" /> {team.leader_name || <span className="italic">N/A</span>}
                        </div>
                        <div className="text-sm font-light text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {team.leader_email || <span className="italic">No Email Data</span>}
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Status */}
                    <td className="p-5">
                      {team.status === 'approved' && <span className="text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-3 h-3 inline mr-1"/> Approved</span>}
                      {team.status === 'rejected' && <span className="text-xs text-red-400 bg-red-400/10 px-3 py-1.5 rounded-full"><XCircle className="w-3 h-3 inline mr-1"/> Rejected</span>}
                      {team.status === 'pending' && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full"><AlertTriangle className="w-3 h-3 inline mr-1"/> Pending</span>}
                    </td>

                    {/* Column 3: Checkpoints */}
                    <td className="p-5">
                      <div className="flex gap-4">
                        {[1, 2, 3].map((cpNum) => (
                          <div key={cpNum} className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-gray-500 uppercase">CP {cpNum}</span>
                            {hasCP(cpNum) ? (
                              <a href={getCPLink(cpNum)} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300">
                                <CheckCircle2 className="w-5 h-5" />
                              </a>
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-700" />
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Column 4: Final Submission */}
                    <td className="p-5">
                      {finalSub ? (
                        <div className="flex flex-col gap-2">
                          <a href={finalSub.final_repo_link} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> GitHub Repo
                          </a>
                          <a href={finalSub.presentation_link} target="_blank" rel="noreferrer" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Pitch Deck
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600 italic">No final submission</span>
                      )}
                    </td>

                    {/* Column 5: Actions */}
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {team.status !== 'approved' && (
                          <button onClick={() => handleUpdateStatus(team.id, 'approved')} className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg" title="Approve">
                            <UserCheck className="w-5 h-5" />
                          </button>
                        )}
                        {team.status !== 'rejected' && (
                          <button onClick={() => handleUpdateStatus(team.id, 'rejected')} className="p-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg" title="Reject">
                            <UserX className="w-5 h-5" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteTeam(team.id, team.team_name)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg ml-2" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}