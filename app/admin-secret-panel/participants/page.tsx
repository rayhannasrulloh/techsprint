// File: src/app/admin-secret-panel/participants/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, Database, CheckCircle2, XCircle, 
  Trash2, UserCheck, UserX, AlertTriangle, Download, ExternalLink, User,
  Clock, Eye, CircleDashed, Receipt, Phone
} from "lucide-react";

// Import Modal
import CheckpointModal from "@/components/admin/CheckpointModal";

// KONFIGURASI WAKTU HACKATHON (WIB)
const START_TIME = new Date("2026-05-09T12:00:00+07:00").getTime();
const CP_DEADLINES: Record<number, number> = {
  1: START_TIME + (6 * 60 * 60 * 1000),  
  2: START_TIME + (12 * 60 * 60 * 1000), 
  3: START_TIME + (18 * 60 * 60 * 1000), 
};

export default function ParticipantsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter States
  const [activeStatusTab, setActiveStatusTab] = useState("All");
  const [activeTrackTab, setActiveTrackTab] = useState("All");
  
  const [now, setNow] = useState<number>(new Date().getTime());
  
  // Modal State
  const [isCpModalOpen, setIsCpModalOpen] = useState(false);
  const [selectedCp, setSelectedCp] = useState<any>(null);

  // Real-time clock untuk status Checkpoint
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('teams').select(`
        id, team_name, track, status, created_at, 
        institution, leader_name, leader_email, leader_nim, leader_phone, discord_username,
        member1_name, member2_nim, member2_name, member3_nim,
        cv_link, payment_proof_url,
        checkpoints ( id, checkpoint_number, github_link, report_text, created_at, is_reviewed ),
        submissions ( final_repo_link, presentation_link )
      `).order('created_at', { ascending: false });
    
    if (data) setTeamsData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // --- ACTIONS ---
  const handleUpdateStatus = async (teamId: string, newStatus: string) => {
    if (!window.confirm(`Mark this team as ${newStatus.toUpperCase()}?`)) return;
    try {
      await fetch("/api/admin/team", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teamId, status: newStatus }) });
      await fetchTeams();
    } catch (err) { alert("Error updating status"); }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (window.prompt(`DANGER: Type "${teamName}" to confirm deletion.`) !== teamName) return;
    try {
      const res = await fetch("/api/admin/team", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teamId }) });
      if (res.ok) { alert("Team deleted."); await fetchTeams(); }
    } catch (err: any) { alert(`Error: ${err.message}`); }
  };

  const handleReviewCheckpoint = async (cpId: string) => {
    try {
      const res = await fetch("/api/admin/checkpoint", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cpId, is_reviewed: true }) });
      if (res.ok) { setIsCpModalOpen(false); await fetchTeams(); }
    } catch (err) { alert("Failed to review checkpoint"); }
  };

  const openCpModal = (team: any, cp: any, cpNum: number) => {
    const submitTime = new Date(cp.created_at).getTime();
    setSelectedCp({ 
      ...cp, 
      team_name: team.team_name, 
      track: team.track, 
      isLate: submitTime > CP_DEADLINES[cpNum], 
      deadline: CP_DEADLINES[cpNum], 
      submitTime 
    });
    setIsCpModalOpen(true);
  };

  // --- EXPORT CSV ---
  const handleExportCSV = () => {
    const headers = [
      "Team Name", "Track", "Institution", "Status", "Discord Username",
      "Leader Name", "Leader Email", "Leader Phone", "Leader NIM", 
      "Member 2 Name", "Member 2 NIM", "Member 3 Name", "Member 3 NIM", 
      "CV Link", "Payment Receipt URL",
      "CP 1", "CP 2", "CP 3", "Final Repo", "Pitch Deck"
    ];
    
    const csvData = filteredTeams.map(team => {
      const hasCP = (num: number) => team.checkpoints?.some((cp: any) => cp.checkpoint_number === num) ? "Done" : "Pending";
      const finalSub = team.submissions && team.submissions.length > 0 ? team.submissions[0] : null;
      return [
        team.team_name, team.track, team.institution || "-", team.status, team.discord_username || "-",
        team.leader_name || "-", team.leader_email || "-", team.leader_phone || "-", team.leader_nim || "-",
        team.member1_name || "-", team.member2_nim || "-", team.member2_name || "-", team.member3_nim || "-",
        team.cv_link || "-", team.payment_proof_url || "-",
        hasCP(1), hasCP(2), hasCP(3), finalSub?.final_repo_link || "No", finalSub?.presentation_link || "No"
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(",");
    });

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `3IN1_TechSprint_${activeTrackTab.replace('/', '')}_${activeStatusTab}_Teams.csv`;
    link.click();
  };

  // --- FILTERING ---
  const filteredTeams = teamsData.filter(t => 
    (t.team_name.toLowerCase().includes(searchQuery.toLowerCase()) || (t.leader_email && t.leader_email.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (activeTrackTab === "All" || t.track === activeTrackTab) &&
    (activeStatusTab === "All" || t.status.toLowerCase() === activeStatusTab.toLowerCase())
  );

  return (
    <div className="p-8 max-w-[90rem] mx-auto animate-in fade-in duration-500">
      
      {/* Panggil Modal Checkpoint */}
      <CheckpointModal 
        isOpen={isCpModalOpen} 
        onClose={() => setIsCpModalOpen(false)} 
        selectedCp={selectedCp} 
        onReview={handleReviewCheckpoint} 
      />

      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-light flex items-center gap-3"><Database className="text-blue-500" /> Participants Data</h1>
          <p className="text-gray-400 text-sm mt-1">Manage, verify, and monitor all registered teams.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search team or email..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-[#0c122b] border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500" 
            />
          </div>
          <button 
            onClick={handleExportCSV} 
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-full hover:bg-emerald-600/40 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4"/> Export CSV
          </button>
        </div>
      </div>

      {/* DUAL FILTERS: TRACK & STATUS */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6 pb-4 border-b border-white/10">
        
        {/* TRACK TABS */}
        <div className="flex gap-2 overflow-x-auto">
          {["All", "UI/UX", "Data Automation", "System Analyst"].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTrackTab(tab)} 
              className={`px-6 py-2.5 rounded-lg text-sm font-light transition-all ${activeTrackTab === tab ? "bg-blue-600/20 text-blue-400 border border-blue-500/50" : "text-gray-400 hover:bg-white/5 border border-transparent"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* STATUS TABS */}
        <div className="flex gap-2 bg-[#0c122b] p-1.5 rounded-xl border border-white/5">
          {["Approved", "Pending", "Rejected", "All"].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveStatusTab(tab)} 
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeStatusTab === tab ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-[#0c122b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto relative min-h-[400px]">
        
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c122b]/80 z-10 backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-blue-400 text-sm animate-pulse">Loading participants data...</p>
          </div>
        ) : null}

        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-white/5 text-xs uppercase tracking-widest text-gray-400 border-b border-white/10">
              <th className="p-5 font-semibold">Team Info</th>
              <th className="p-5 font-semibold">Status & Payment</th>
              <th className="p-5 font-semibold">Checkpoints</th>
              <th className="p-5 font-semibold">Final Submission</th>
              <th className="p-5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => {
                const finalSub = team.submissions && team.submissions.length > 0 ? team.submissions[0] : null;

                return (
                  <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-lg text-blue-100">{team.team_name}</p>
                          <span className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-300 rounded-md">{team.track}</span>
                        </div>
                        <div className="text-xs font-medium text-purple-400 mt-1">{team.institution}</div>
                        <div className="text-sm text-gray-400 mt-1 flex items-center gap-1"><User className="w-3 h-3"/> {team.leader_name} <span className="text-gray-600">({team.leader_nim})</span></div>
                        <div className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3"/> {team.leader_phone || <span className="italic">No phone</span>}</div>
                      </div>
                    </td>
                    
                    <td className="p-5">
                      <div className="flex flex-col gap-2 items-start">
                        <span className={`text-xs px-3 py-1.5 rounded-full ${team.status === 'approved' ? 'text-emerald-400 bg-emerald-400/10' : team.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'}`}>
                          {team.status.toUpperCase()}
                        </span>
                        {team.payment_proof_url && (
                          <a href={team.payment_proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 hover:underline bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                            <Receipt className="w-3 h-3" /> View Receipt
                          </a>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-5">
                      <div className="flex gap-4">
                        {[1, 2, 3].map((cpNum) => {
                          const cp = team.checkpoints?.find((c: any) => c.checkpoint_number === cpNum);
                          let statusColor = ""; let Icon = null;
                          if (cp) {
                            const isLate = new Date(cp.created_at).getTime() > CP_DEADLINES[cpNum];
                            if (!cp.is_reviewed) { statusColor = "text-yellow-400 bg-yellow-400/10 border-yellow-500/30 hover:bg-yellow-400/20"; Icon = Clock; } 
                            else { statusColor = isLate ? "text-red-400 bg-red-400/10 border-red-500/30 hover:bg-red-400/20" : "text-emerald-400 bg-emerald-400/10 border-emerald-500/30 hover:bg-emerald-400/20"; Icon = isLate ? AlertTriangle : CheckCircle2; }
                          } else {
                            if (now > CP_DEADLINES[cpNum]) { statusColor = "text-gray-600 bg-gray-900 border-gray-800"; Icon = XCircle; } 
                            else { statusColor = "text-gray-500 bg-white/5 border-white/10"; Icon = CircleDashed; }
                          }
                          return (
                            <div key={cpNum} className="flex flex-col items-center gap-1">
                              <span className="text-[10px] text-gray-500 uppercase font-semibold">CP {cpNum}</span>
                              {cp ? (
                                <button onClick={() => openCpModal(team, cp, cpNum)} className={`p-2 rounded-xl border transition-all hover:scale-105 ${statusColor} group relative`}>
                                  <Icon className="w-5 h-5" />
                                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Eye className="w-3 h-3" />
                                  </span>
                                </button>
                              ) : (
                                <div className={`p-2 rounded-xl border ${statusColor}`}><Icon className="w-5 h-5 opacity-50" /></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    
                    <td className="p-5">
                      {finalSub ? (
                        <div className="flex flex-col gap-2">
                          <a href={finalSub.final_repo_link} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Repo Link
                          </a>
                          <a href={finalSub.presentation_link} target="_blank" rel="noreferrer" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Pitch Deck
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600 italic">No submission yet</span>
                      )}
                    </td>

                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {team.status !== 'approved' && <button onClick={() => handleUpdateStatus(team.id, 'approved')} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20"><UserCheck className="w-5 h-5" /></button>}
                        {team.status !== 'rejected' && <button onClick={() => handleUpdateStatus(team.id, 'rejected')} className="p-2 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20"><UserX className="w-5 h-5" /></button>}
                        <button onClick={() => handleDeleteTeam(team.id, team.team_name)} className="p-2 bg-red-500/10 text-red-500 rounded-lg ml-2 hover:bg-red-500/20"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-16 text-center text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No Teams Found</p>
                  <p className="text-sm mt-1 font-light">
                    No matching teams in <strong className="text-white">{activeTrackTab}</strong> track with <strong className="text-white">{activeStatusTab}</strong> status.
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