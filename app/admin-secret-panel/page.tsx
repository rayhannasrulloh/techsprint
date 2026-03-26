// File: src/app/admin-secret-panel/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Database, CheckCircle2, XCircle, Trash2, UserCheck, UserX, AlertTriangle, 
  Download, ExternalLink, Mail, User, Timer, Lock, Unlock, Activity, Clock, 
  Eye, Github, CircleDashed, Megaphone, Receipt, Phone, Search
} from "lucide-react";
import Link from "next/link";

// Import Komponen Modals
import BroadcastModal from "@/components/admin/BroadcastModal";
import CheckpointModal from "@/components/admin/CheckpointModal";

const ADMIN_EMAILS = ["rayhan.nasrulloh@student.president.ac.id", "admin@techsprint.web.id"];

// KONFIGURASI WAKTU HACKATHON (WIB)
const START_TIME = new Date("2026-05-09T12:00:00+07:00").getTime();
const END_TIME = new Date("2026-05-10T12:00:00+07:00").getTime();
const CP_DEADLINES: Record<number, number> = {
  1: START_TIME + (6 * 60 * 60 * 1000),  
  2: START_TIME + (12 * 60 * 60 * 1000), 
  3: START_TIME + (18 * 60 * 60 * 1000), 
};

export default function AdminPanelPage() {
  const router = useRouter();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter States
  const [activeStatusTab, setActiveStatusTab] = useState("Pending");
  const [activeTrackTab, setActiveTrackTab] = useState("All");
  
  const [now, setNow] = useState<number>(new Date().getTime());
  
  // Modal States
  const [isCpModalOpen, setIsCpModalOpen] = useState(false);
  const [selectedCp, setSelectedCp] = useState<any>(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTeams = async () => {
    const { data } = await supabase.from('teams').select(`
        id, team_name, track, status, created_at, 
        institution, leader_name, leader_email, leader_nim, leader_phone, discord_username,
        member1_name, member2_nim, member2_name, member3_nim,
        cv_link, payment_proof_url,
        checkpoints ( id, checkpoint_number, github_link, report_text, created_at, is_reviewed ),
        submissions ( final_repo_link, presentation_link )
      `).order('created_at', { ascending: false });
    if (data) setTeamsData(data);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !ADMIN_EMAILS.includes(session.user.email || "")) {
        setIsAdmin(false); setIsLoading(false); return;
      }
      setIsAdmin(true); await fetchTeams(); setIsLoading(false);
    };
    checkAdmin();
  }, [router]);

  // Actions
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
    setSelectedCp({ ...cp, team_name: team.team_name, track: team.track, isLate: submitTime > CP_DEADLINES[cpNum], deadline: CP_DEADLINES[cpNum], submitTime });
    setIsCpModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = [
      "Team Name", "Track", "Institution", "Status", "Discord Username",
      "Leader Name", "Leader Email", "Leader Phone", "Leader NIM", 
      "Member 2 Name", "Member 2 NIM", "Member 3 Name", "Member 3 NIM", 
      "CV Link", "Payment Receipt URL",
      "CP 1", "CP 2", "CP 3", "Final Repo", "Pitch Deck"
    ];
    
    const csvData = filteredTeams.map(team => {
      const hasCP = (num: number) => team.checkpoints.some((cp: any) => cp.checkpoint_number === num) ? "Done" : "Pending";
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

  // --- LOGIKA PERHITUNGAN TIMELINE ---
  const isStarted = now >= START_TIME;
  const isEnded = now >= END_TIME;
  
  let targetTime = START_TIME;
  if (isStarted && !isEnded) targetTime = END_TIME;
  
  const diff = Math.max(0, isStarted && !isEnded ? targetTime - now : START_TIME - now);
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  let currentPhase = "Pre-Event";
  let lockStatus = "LOCKED";
  let lockColor = "text-red-400 bg-red-400/10";
  
  if (isEnded) {
    currentPhase = "Event Ended"; lockStatus = "ALL LOCKED";
  } else if (isStarted) {
    if (now < CP_DEADLINES[1]) { currentPhase = "Phase 1 (Towards CP1)"; lockStatus = "OPEN: CP 1"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
    else if (now < CP_DEADLINES[2]) { currentPhase = "Phase 2 (Towards CP2)"; lockStatus = "OPEN: CP 2"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
    else if (now < CP_DEADLINES[3]) { currentPhase = "Phase 3 (Towards CP3)"; lockStatus = "OPEN: CP 3"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
    else { currentPhase = "Final Sprint (Towards Final)"; lockStatus = "OPEN: FINAL"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
  }
  const progressPct = isEnded ? 100 : isStarted ? ((now - START_TIME) / (END_TIME - START_TIME)) * 100 : 0;

  // --- STATS LOGIC ---
  const totalTeams = teamsData.length;
  const approvedTeams = teamsData.filter(t => t.status === 'approved').length;
  const pendingTeams = teamsData.filter(t => t.status === 'pending').length;
  const rejectedTeams = teamsData.filter(t => t.status === 'rejected').length;
  const uiuxCount = teamsData.filter(t => t.track === 'UI/UX').length;
  const dataCount = teamsData.filter(t => t.track === 'Data Automation').length;
  const saCount = teamsData.filter(t => t.track === 'System Analyst').length;

  if (isLoading) return <div className="min-h-screen bg-[#050814] flex items-center justify-center text-blue-500">Loading Secure Data...</div>;
  if (!isAdmin) return <div className="min-h-screen bg-[#050814] flex items-center justify-center"><h1 className="text-4xl text-red-500">Access Denied</h1></div>;

  return (
    <div className="min-h-screen bg-[#050814] text-white p-8 font-sans relative">
      <BroadcastModal isOpen={isBroadcastModalOpen} onClose={() => setIsBroadcastModalOpen(false)} />
      <CheckpointModal isOpen={isCpModalOpen} onClose={() => setIsCpModalOpen(false)} selectedCp={selectedCp} onReview={handleReviewCheckpoint} />

      <div className="max-w-[90rem] mx-auto">
        {/* HEADER CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-light flex items-center gap-3"><Database className="text-blue-500" /> Command Center</h1>
            <p className="text-gray-400 text-sm mt-1">Real-time statistics for 3IN1 Tech Sprint 2026</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search team or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#0c122b] border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <Link href="/admin-secret-panel/inbox" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full hover:bg-blue-600/40 text-sm"><Mail className="w-4 h-4"/> Inbox</Link>
            <button onClick={() => setIsBroadcastModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full hover:bg-purple-600/40 text-sm"><Megaphone className="w-4 h-4"/> Broadcast</button>
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-full hover:bg-emerald-600/40 text-sm"><Download className="w-4 h-4"/> Export CSV</button>
          </div>
        </div>

        {/* --- GLOBAL TIMELINE & COUNTDOWN (DIKEMBALIKAN) --- */}
        <div className="bg-[#0c122b] border border-white/5 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-600/10 blur-[100px] rounded-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-400 font-light mb-2 flex items-center justify-center lg:justify-start gap-2">
                <Timer className="w-4 h-4 text-blue-400" />
                {isEnded ? "Hackathon Completed" : isStarted ? "Time Remaining" : "Event Starts In"}
              </p>
              <div className="text-5xl md:text-6xl font-light tracking-wider text-white">
                {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex justify-between text-[10px] md:text-xs text-gray-500 mb-2 font-medium tracking-wider uppercase">
                <span>Start<br/><span className="font-light text-gray-600">09 May 12:00</span></span>
                <span className="text-center">CP1<br/><span className="font-light text-gray-600">09 May 18:00</span></span>
                <span className="text-center">CP2<br/><span className="font-light text-gray-600">10 May 00:00</span></span>
                <span className="text-center">CP3<br/><span className="font-light text-gray-600">10 May 06:00</span></span>
                <span className="text-right">Final<br/><span className="font-light text-gray-600">10 May 12:00</span></span>
              </div>
              <div className="relative w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000 ease-linear" style={{ width: `${progressPct}%` }}></div>
                <div className="absolute top-0 left-1/4 w-px h-full bg-black/50"></div>
                <div className="absolute top-0 left-2/4 w-px h-full bg-black/50"></div>
                <div className="absolute top-0 left-3/4 w-px h-full bg-black/50"></div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-light text-gray-300">Phase: <strong className="text-white font-medium">{currentPhase}</strong></span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider border border-white/5 ${lockColor}`}>
                  {lockStatus.includes("OPEN") ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {lockStatus}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- STATISTIC DASHBOARD DENGAN TRACK COUNTS (DIKEMBALIKAN) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Box 1: Total Teams */}
          <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-sm font-light text-gray-400 mb-1">Total Teams Registered</p>
            <h3 className="text-4xl font-normal text-white">{totalTeams}</h3>
            <p className="text-xs text-blue-400 mt-2">Est. {totalTeams * 3} Individual Participants</p>
          </div>

          {/* Box 2: Verification Status */}
          <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-5">
            <p className="text-sm font-light text-gray-400 mb-3">Verification Status (RSVP)</p>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400"/> Approved</span>
              <span className="font-medium text-emerald-400">{approvedTeams}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-300 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-yellow-400"/> Pending</span>
              <span className="font-medium text-yellow-400">{pendingTeams}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-300 flex items-center gap-1"><XCircle className="w-3 h-3 text-red-400"/> Rejected</span>
              <span className="font-medium text-red-400">{rejectedTeams}</span>
            </div>
          </div>

          {/* Box 3 & 4: Track Categories */}
          <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-5 lg:col-span-2">
            <p className="text-sm font-light text-gray-400 mb-3">Registrations by Track Category</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-2xl font-normal text-white">{uiuxCount}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">UI/UX Design</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-2xl font-normal text-white">{dataCount}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Data Auto</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-2xl font-normal text-white">{saCount}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Sys Analyst</p>
              </div>
            </div>
          </div>
        </div>

        {/* DUAL FILTERS: TRACK & STATUS */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6 pb-4 border-b border-white/10">
          
          {/* TRACK TABS (DIKEMBALIKAN KE KIRI BERSAMAAN DENGAN STATUS) */}
          <div className="flex gap-2 overflow-x-auto">
            {["All", "UI/UX", "Data Automation", "System Analyst"].map((tab) => (
              <button key={tab} onClick={() => setActiveTrackTab(tab)} className={`px-6 py-2.5 rounded-lg text-sm font-light transition-all ${activeTrackTab === tab ? "bg-blue-600/20 text-blue-400 border border-blue-500/50" : "text-gray-400 hover:bg-white/5 border border-transparent"}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* STATUS TABS */}
          <div className="flex gap-2 bg-[#0c122b] p-1.5 rounded-xl border border-white/5">
            {["Pending", "Approved", "Rejected", "All"].map(tab => (
              <button key={tab} onClick={() => setActiveStatusTab(tab)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeStatusTab === tab ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TABEL DATA */}
        <div className="bg-[#0c122b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
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
                          <div className="flex items-center gap-2"><p className="font-medium text-lg text-blue-100">{team.team_name}</p><span className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-300 rounded-md">{team.track}</span></div>
                          <div className="text-xs font-medium text-purple-400 mt-1">{team.institution}</div>
                          <div className="text-sm text-gray-400 mt-1 flex items-center gap-1"><User className="w-3 h-3"/> {team.leader_name} <span className="text-gray-600">({team.leader_nim})</span></div>
                          <div className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3"/> {team.leader_phone}</div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-2 items-start">
                          <span className={`text-xs px-3 py-1.5 rounded-full ${team.status === 'approved' ? 'text-emerald-400 bg-emerald-400/10' : team.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'}`}>{team.status.toUpperCase()}</span>
                          {team.payment_proof_url && <a href={team.payment_proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 hover:underline bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20"><Receipt className="w-3 h-3" /> View Receipt</a>}
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
                                  <button onClick={() => openCpModal(team, cp, cpNum)} className={`p-2 rounded-xl border transition-all hover:scale-105 ${statusColor} group relative`}><Icon className="w-5 h-5" /><span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Eye className="w-3 h-3" /></span></button>
                                ) : (
                                  <div className={`p-2 rounded-xl border ${statusColor}`}><Icon className="w-5 h-5 opacity-50" /></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      
                      {/* --- KOLOM FINAL SUBMISSION DIKEMBALIKAN (REPO & PITCH DECK) --- */}
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
    </div>
  );
}