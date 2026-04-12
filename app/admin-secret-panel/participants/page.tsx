// File: src/app/admin-secret-panel/participants/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Search, Database, CheckCircle2, XCircle,
  Trash2, UserCheck, UserX, AlertTriangle, Download, ExternalLink, User,
  Clock, Eye, CircleDashed, Receipt, Phone, Instagram, Image, MessageSquare, Mail
} from "lucide-react";

// Import Modal
import CheckpointModal from "@/components/admin/CheckpointModal";

import { ADMIN_EMAILS } from "@/app/admin-secret-panel/layout";

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
  const [accountType, setAccountType] = useState("Participants");

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
        ig_follow_proof_url, twibbon_proof_url, ig_story_proof_url,
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
      "IG Follow Proof", "Twibbon Proof", "Story & Tag Proof",
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
        team.ig_follow_proof_url || "-",
        team.twibbon_proof_url || "-",
        team.ig_story_proof_url || "-",
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
  const filteredTeams = teamsData.filter(t => {
    // Cek apakah email termasuk dalam daftar admin hardcoded
    const isAdminAccount = ADMIN_EMAILS.includes(t.leader_email);

    const matchType = accountType === "Committee" ? isAdminAccount : !isAdminAccount;
    const matchSearch = t.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.leader_email && t.leader_email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = activeStatusTab === "All" || t.status.toLowerCase() === activeStatusTab.toLowerCase();

    return matchType && matchSearch && matchStatus;
  });

  return (
    <div className="max-w-[90rem] mx-auto animate-in fade-in duration-500">

      {/* Panggil Modal Checkpoint */}
      <CheckpointModal
        isOpen={isCpModalOpen}
        onClose={() => setIsCpModalOpen(false)}
        selectedCp={selectedCp}
        onReview={handleReviewCheckpoint}
      />

      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 p-6 gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-wider flex items-center gap-3">Participants Data</h1>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setAccountType("Participants")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${accountType === "Participants" ? "bg-blue-600 text-white shadow-lg" : "bg-white/5 text-gray-500 hover:text-white"}`}
          >
            Teams (Participants)
          </button>
          <button
            onClick={() => setAccountType("Committee")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${accountType === "Committee" ? "bg-purple-600 text-white shadow-lg" : "bg-white/5 text-gray-500 hover:text-white"}`}
          >
            Committee Accounts (Admin)
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search team or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* TRACK TABS */}
      <div className="flex gap-1.5 bg-[#1c1c1c] p-1.5 border-b border-white/10 rounded-md">
        {["All", "UI/UX", "Data Automation", "System Analyst"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTrackTab(tab)}
            className={`px-4 py-1.5 text-sm font-medium transition-all rounded-md ${activeTrackTab === tab ? "bg-[#2e2e2e] text-white border border-[#3e3e3e] shadow-sm" : "text-gray-400 hover:text-gray-200 border border-transparent"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* STATUS TABS */}
      <div className="flex gap-1.5 bg-[#1c1c1c] p-1.5 border-b border-white/10">
        {["All", "Approved", "Pending", "Rejected"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveStatusTab(tab)}
            className={`px-4 py-1.5 text-sm font-medium transition-all rounded-md ${activeStatusTab === tab ? "bg-[#2e2e2e] text-white border border-[#3e3e3e] shadow-sm" : "text-gray-400 hover:text-gray-200 border border-transparent"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABEL DATA */}
      <div className="bg-[#1c1c1c] border border-white/10 overflow-hidden shadow-sm overflow-x-auto relative min-h-[400px]">

        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c]/80 z-10 backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-400 text-sm animate-pulse">Loading participants data...</p>
          </div>
        ) : null}

        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-white/5 text-center tracking-widest text-gray-400 border-b border-white/10">
              <th className="p-5 font-medium w-12">No.</th>
              <th className="p-5 font-medium">Team Info</th>
              <th className="p-5 font-medium">Status & Payment</th>
              <th className="p-5 font-medium">Checkpoints</th>
              <th className="p-5 font-medium">Final Submission</th>
              <th className="p-5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team, index) => {
                const finalSub = team.submissions && team.submissions.length > 0 ? team.submissions[0] : null;

                return (
                  <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 border-r border-white/10 text-center text-gray-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="border-r border-white/10">
                      <div className="flex flex-col gap-1">
                        <div className="p-1 px-2 text-lg border-b border-white/5 flex items-center gap-2">
                          <p className="font-medium">{team.team_name}</p>
                        </div>
                        <div className="p-1 px-2 text-xs border-b border-white/5">{team.track}</div>
                        <div className="p-1 px-2 text-xs border-b border-white/5 font-medium mt-1">{team.institution}</div>
                        <div className="p-1 px-2 text-sm border-b border-white/5 text-gray-400 mt-1 flex items-center gap-1"><User className="w-3 h-3" /> {team.leader_name} <span className="text-gray-600">({team.leader_nim})</span></div>
                        <div className="p-1 px-2 text-sm border-b border-white/5 text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {team.leader_email || <span className="italic">No email</span>}</div>
                        <div className="p-1 px-2 text-sm border-b border-white/5 text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {team.leader_phone || <span className="italic">No phone</span>}</div>
                      </div>
                    </td>

                    <td className="p-5 border-r border-white/10">
                      <div className="flex flex-col gap-2 items-start">
                        {/* Status Label */}
                        <span className={`flex items-center text-xs w-full py-1 rounded-md border border-white/10 justify-center ${team.status === 'approved' ? 'text-emerald-400 bg-emerald-400/10' : team.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'}`}>
                          {team.status.toUpperCase()}
                        </span>

                        {/* Bukti Pembayaran */}
                        {team.payment_proof_url && (
                          <a href={team.payment_proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 w-full justify-center">
                            <Receipt className="w-3 h-3" /> Payment Receipt
                          </a>
                        )}

                        {/* --- BUKTI SOSIAL MEDIA (NEW) --- */}
                        <div className="grid grid-cols-1 gap-1 w-full">
                          {team.ig_follow_proof_url && (
                            <a href={team.ig_follow_proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[9px] text-pink-400 hover:text-pink-300 bg-pink-500/10 px-2 py-1 rounded-md border border-pink-500/20">
                              <Instagram className="w-3 h-3" /> Follow Proof
                            </a>
                          )}
                          {team.twibbon_proof_url && (
                            <a href={team.twibbon_proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[9px] text-emerald-400 hover:text-emerald-300 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-500/20">
                              <Image className="w-3 h-3" /> Twibbon Proof
                            </a>
                          )}
                          {team.ig_story_proof_url && (
                            <a href={team.ig_story_proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[9px] text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">
                              <MessageSquare className="w-3 h-3" /> Story & Tag
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-5 border-r border-white/10">
                      <div className="flex gap-4 items-center justify-center">
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

                    <td className="p-5 border-r border-white/10">
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

                    <td className="p-5">
                      <div className="flex justify-start gap-2">
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
                <td colSpan={6} className="p-16 text-center text-gray-500">
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