// File: src/app/admin-secret-panel/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ShieldAlert, Search, Database, CheckCircle2, XCircle, 
  Trash2, UserCheck, UserX, AlertTriangle, Download, ExternalLink, Mail, User,
  Timer, Lock, Unlock, Activity, Clock, Eye, X, Github, CircleDashed
} from "lucide-react";
import Link from "next/link";

// 🔒 GANTI DENGAN EMAIL PANITIA & JURI
const ADMIN_EMAILS = ["rayhan.nasrulloh@student.president.ac.id", "admin@techsprint.web.id"];

// 🕒 KONFIGURASI WAKTU HACKATHON (WIB)
const START_TIME = new Date("2026-05-09T12:00:00+07:00").getTime();
const END_TIME = new Date("2026-05-10T12:00:00+07:00").getTime();
const CP_DEADLINES: Record<number, number> = {
  1: START_TIME + (6 * 60 * 60 * 1000),  // 09 May 18:00
  2: START_TIME + (12 * 60 * 60 * 1000), // 10 May 00:00
  3: START_TIME + (18 * 60 * 60 * 1000), // 10 May 06:00
};

export default function AdminPanelPage() {
  const router = useRouter();
  
  // Auth & Data States
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  
  // Timer State
  const [now, setNow] = useState<number>(new Date().getTime());
  
  // MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCp, setSelectedCp] = useState<any>(null);

  // Real-time Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        id, team_name, track, status, created_at, leader_name, leader_email,
        checkpoints ( id, checkpoint_number, github_link, report_text, created_at, is_reviewed ),
        submissions ( final_repo_link, presentation_link )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("SUPABASE ERROR:", error.message); // INI PENTING UNTUK DEBUGGING
    } else if (data) {
      setTeamsData(data);
    }
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

  // ACTION: Update Status Registrasi (Approve/Reject)
  const handleUpdateStatus = async (teamId: string, newStatus: string) => {
    if (!window.confirm(`Mark this team as ${newStatus.toUpperCase()}?`)) return;
    try {
      const res = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, status: newStatus }),
      });
      if (res.ok) await fetchTeams();
    } catch (err) { alert("Error updating status"); }
  };

  // ACTION: Hapus Tim
  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    const confirmDelete = window.prompt(`DANGER: Type "${teamName}" to confirm deletion.`);
    if (confirmDelete !== teamName) return;
    try {
      const res = await fetch("/api/admin/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      if (res.ok) { alert("Team deleted."); await fetchTeams(); }
    } catch (err) { alert("Error deleting team"); }
  };

  // ACTION: Review Checkpoint
  const handleReviewCheckpoint = async (cpId: string) => {
    try {
      const res = await fetch("/api/admin/checkpoint", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpId, is_reviewed: true }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        await fetchTeams();
      }
    } catch (err) { alert("Failed to review checkpoint"); }
  };

  // ACTION: Open Modal Pop-up Checkpoint
  const openCpModal = (team: any, cp: any, cpNum: number) => {
    const deadline = CP_DEADLINES[cpNum];
    const submitTime = new Date(cp.created_at).getTime();
    const isLate = submitTime > deadline;
    
    setSelectedCp({
      ...cp,
      team_name: team.team_name,
      track: team.track,
      isLate,
      deadline,
      submitTime
    });
    setIsModalOpen(true);
  };

  // EXPORT TO CSV
  const handleExportCSV = () => {
    const headers = [
      "Team Name", "Track Category", "Leader Name", "Leader Email", 
      "Registration Status", "CP 1", "CP 2", "CP 3", "Final Repo", "Pitch Deck"
    ];
    
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
        finalSub?.final_repo_link || "No",
        finalSub?.presentation_link || "No"
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(",");
    });

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `3IN1_TechSprint_Teams.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FILTERING TEAMS (Search & Tabs)
  const filteredTeams = teamsData.filter(team => {
    const matchSearch = team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (team.leader_email && team.leader_email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchTab = activeTab === "All" || team.track === activeTab;
    return matchSearch && matchTab;
  });

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
    currentPhase = "Event Ended";
    lockStatus = "ALL LOCKED";
  } else if (isStarted) {
    if (now < CP_DEADLINES[1]) { currentPhase = "Phase 1 (Towards CP1)"; lockStatus = "OPEN: CP 1"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
    else if (now < CP_DEADLINES[2]) { currentPhase = "Phase 2 (Towards CP2)"; lockStatus = "OPEN: CP 2"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
    else if (now < CP_DEADLINES[3]) { currentPhase = "Phase 3 (Towards CP3)"; lockStatus = "OPEN: CP 3"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
    else { currentPhase = "Final Sprint (Towards Final)"; lockStatus = "OPEN: FINAL"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
  }

  const totalDuration = END_TIME - START_TIME;
  let progressPct = 0;
  if (isEnded) progressPct = 100;
  else if (isStarted) progressPct = ((now - START_TIME) / totalDuration) * 100;

  // --- LOGIKA STATISTIK ---
  const totalTeams = teamsData.length;
  const approvedTeams = teamsData.filter(t => t.status === 'approved').length;
  const pendingTeams = teamsData.filter(t => t.status === 'pending').length;
  const uiuxCount = teamsData.filter(t => t.track === 'UI/UX').length;
  const dataCount = teamsData.filter(t => t.track === 'Data Automation').length;
  const saCount = teamsData.filter(t => t.track === 'System Analyst').length;

  // RENDER LOADING / UNAUTHORIZED
  if (isLoading) return <div className="min-h-screen bg-[#050814] flex items-center justify-center text-blue-500">Loading Secure Data...</div>;
  if (!isAdmin) return <div className="min-h-screen bg-[#050814] flex items-center justify-center"><h1 className="text-4xl text-red-500">Access Denied</h1></div>;

  return (
    <div className="min-h-screen bg-[#050814] text-white p-8 font-sans relative">
      
      {/* --- MODAL POP-UP CHECKPOINT PREVIEW --- */}
      {isModalOpen && selectedCp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0c122b] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
            
            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#080c1f]">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-light text-white">{selectedCp.team_name}</h2>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-900/30 text-blue-300 border border-blue-500/20 rounded-md">{selectedCp.track}</span>
                </div>
                <p className="text-gray-400 text-sm">Checkpoint {selectedCp.checkpoint_number} Submission Preview</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className={`p-4 rounded-xl border flex items-center gap-4 ${selectedCp.isLate ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                {selectedCp.isLate ? <AlertTriangle className="w-8 h-8 text-red-400" /> : <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
                <div>
                  <h3 className={`font-medium ${selectedCp.isLate ? 'text-red-400' : 'text-emerald-400'}`}>
                    {selectedCp.isLate ? "LATE SUBMISSION" : "ON TIME SUBMISSION"}
                  </h3>
                  <p className="text-sm font-light text-gray-300 mt-1">
                    Submitted at: <strong className="text-white">{new Date(selectedCp.submitTime).toLocaleString()}</strong><br/>
                    Deadline was: <strong className="text-gray-400">{new Date(selectedCp.deadline).toLocaleString()}</strong>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Progress Report</h4>
                <div className="bg-[#050814] border border-white/5 rounded-xl p-4 text-gray-300 text-sm font-light leading-relaxed whitespace-pre-wrap">
                  {selectedCp.report_text}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Repository</h4>
                <a href={selectedCp.github_link} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[#050814] border border-white/5 hover:border-blue-500/30 rounded-xl p-4 transition-colors group">
                  <Github className="w-6 h-6 text-gray-400 group-hover:text-blue-400" />
                  <span className="text-sm font-light text-blue-400 group-hover:underline truncate">{selectedCp.github_link}</span>
                  <ExternalLink className="w-4 h-4 text-gray-500 ml-auto group-hover:text-blue-400" />
                </a>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-[#080c1f] flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Close
              </button>
              {!selectedCp.is_reviewed && (
                <button 
                  onClick={() => handleReviewCheckpoint(selectedCp.id)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                >
                  Mark as Reviewed
                </button>
              )}
            </div>

          </div>
        </div>
      )}
      {/* --- END OF MODAL --- */}

      <div className="max-w-[90rem] mx-auto">
        
        {/* HEADER & CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-wide flex items-center gap-3">
              <Database className="text-blue-500" /> Command Center
            </h1>
            <p className="text-gray-400 text-sm mt-1">Real-time statistics for 3IN1 Tech Sprint 2026</p>
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
            
            <Link 
              href="/admin-secret-panel/inbox"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full hover:bg-blue-600/40 transition-colors text-sm font-medium"
            >
              <Mail className="w-4 h-4" /> Inbox
            </Link>

            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-full hover:bg-emerald-600/40 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* --- GLOBAL TIMELINE & COUNTDOWN --- */}
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

        {/* --- STATISTIC DASHBOARD --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-sm font-light text-gray-400 mb-1">Total Teams Registered</p>
            <h3 className="text-4xl font-normal text-white">{totalTeams}</h3>
            <p className="text-xs text-blue-400 mt-2">Est. {totalTeams * 3} Individual Participants</p>
          </div>

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

        {/* TABS & MAIN TABLE */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-2 border-b border-white/10">
          {["All", "UI/UX", "Data Automation", "System Analyst"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-t-lg font-light transition-all ${activeTab === tab ? "bg-blue-600/20 text-blue-400 border-b-2 border-blue-500" : "text-gray-400 hover:bg-white/5"}`}>
              {tab}
            </button>
          ))}
        </div>

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
                const finalSub = team.submissions && team.submissions.length > 0 ? team.submissions[0] : null;

                return (
                  <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Column: Team Info */}
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
                          <Mail className="w-3 h-3" /> {team.leader_email || <span className="italic">No Email</span>}
                        </div>
                      </div>
                    </td>

                    {/* Column: Registration Status */}
                    <td className="p-5">
                      {team.status === 'approved' && <span className="text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-3 h-3 inline mr-1"/> Approved</span>}
                      {team.status === 'rejected' && <span className="text-xs text-red-400 bg-red-400/10 px-3 py-1.5 rounded-full"><XCircle className="w-3 h-3 inline mr-1"/> Rejected</span>}
                      {team.status === 'pending' && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full"><AlertTriangle className="w-3 h-3 inline mr-1"/> Pending</span>}
                    </td>

                    {/* Column: Checkpoints Tracker */}
                    <td className="p-5">
                      <div className="flex gap-4">
                        {[1, 2, 3].map((cpNum) => {
                          const cp = team.checkpoints.find((c: any) => c.checkpoint_number === cpNum);
                          const deadline = CP_DEADLINES[cpNum];
                          
                          let statusColor = "";
                          let Icon = null;
                          let tooltipText = "";

                          if (cp) {
                            const isLate = new Date(cp.created_at).getTime() > deadline;
                            if (!cp.is_reviewed) {
                              statusColor = "text-yellow-400 bg-yellow-400/10 border-yellow-500/30 hover:bg-yellow-400/20"; 
                              Icon = Clock;
                              tooltipText = "Needs Review";
                            } else {
                              statusColor = isLate ? "text-red-400 bg-red-400/10 border-red-500/30 hover:bg-red-400/20" : "text-emerald-400 bg-emerald-400/10 border-emerald-500/30 hover:bg-emerald-400/20";
                              Icon = isLate ? AlertTriangle : CheckCircle2;
                              tooltipText = isLate ? "Reviewed (Late)" : "Reviewed (On Time)";
                            }
                          } else {
                            if (now > deadline) {
                              statusColor = "text-gray-600 bg-gray-900 border-gray-800";
                              Icon = XCircle;
                              tooltipText = "Missed Deadline";
                            } else {
                              statusColor = "text-gray-500 bg-white/5 border-white/10";
                              Icon = CircleDashed;
                              tooltipText = "Waiting for submission";
                            }
                          }

                          return (
                            <div key={cpNum} className="flex flex-col items-center gap-1">
                              <span className="text-[10px] text-gray-500 uppercase font-semibold">CP {cpNum}</span>
                              {cp ? (
                                <button onClick={() => openCpModal(team, cp, cpNum)} title={tooltipText} className={`p-2 rounded-xl border transition-all ${statusColor} group relative`}>
                                  <Icon className="w-5 h-5" />
                                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                    <Eye className="w-3 h-3" />
                                  </span>
                                </button>
                              ) : (
                                <div title={tooltipText} className={`p-2 rounded-xl border ${statusColor}`}>
                                  <Icon className="w-5 h-5 opacity-50" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Column: Final Submission */}
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

                    {/* Column: Actions */}
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {team.status !== 'approved' && <button onClick={() => handleUpdateStatus(team.id, 'approved')} className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg" title="Approve"><UserCheck className="w-5 h-5" /></button>}
                        {team.status !== 'rejected' && <button onClick={() => handleUpdateStatus(team.id, 'rejected')} className="p-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg" title="Reject"><UserX className="w-5 h-5" /></button>}
                        <button onClick={() => handleDeleteTeam(team.id, team.team_name)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg ml-2" title="Delete"><Trash2 className="w-5 h-5" /></button>
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