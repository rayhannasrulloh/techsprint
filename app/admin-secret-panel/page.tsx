// File: src/app/admin-secret-panel/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ShieldAlert, Search, Database, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

// 🔒 GANTI DENGAN EMAIL PANITIA & JURI YANG DIIZINKAN
const ADMIN_EMAILS = [
  "rayhan.nasrulloh@student.president.ac.id", 
  "bod@president.ac.id",
  "judge1@techsprint.com"
];

export default function AdminPanelPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      // 1. Check Authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      // 2. Check if User Email is in the Admin Whitelist
      if (!ADMIN_EMAILS.includes(session.user.email || "")) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      setIsAdmin(true);

      // 3. Fetch Relational Data (Teams + Checkpoints + Submissions)
      const { data, error } = await supabase
        .from('teams')
        .select(`
          id,
          team_name,
          track,
          checkpoints ( checkpoint_number, github_link, report_text ),
          submissions ( final_repo_link, presentation_link )
        `)
        .order('team_name', { ascending: true });

      if (error) {
        console.error("Error fetching admin data:", error);
      } else {
        setTeamsData(data || []);
      }
      
      setIsLoading(false);
    };

    checkAdminAndFetchData();
  }, [router]);

  // Filter teams based on search query
  const filteredTeams = teamsData.filter(team => 
    team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.track.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Jika Loading
  if (isLoading) {
    return <div className="min-h-screen bg-[#050814] flex items-center justify-center text-blue-500">Loading Secure Data...</div>;
  }

  // Jika Bukan Admin (Akses Ditolak)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center text-white">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400">You do not have permission to view this page.</p>
        <button onClick={() => router.push("/dashboard")} className="mt-8 px-6 py-3 bg-blue-600 rounded-full">Return to Dashboard</button>
      </div>
    );
  }

  // TAMPILAN ADMIN PANEL
  return (
    <div className="min-h-screen bg-[#050814] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-wide flex items-center gap-3">
              <Database className="text-blue-500" /> Command Center
            </h1>
            <p className="text-gray-400 text-sm mt-1">Authorized Personnel Only. Total Teams: {teamsData.length}</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search team or track..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c122b] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#0c122b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-xs uppercase tracking-widest text-gray-400 border-b border-white/10">
                <th className="p-5 font-semibold">Team Info</th>
                <th className="p-5 font-semibold">Checkpoints Status</th>
                <th className="p-5 font-semibold">Final Submission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTeams.length > 0 ? filteredTeams.map((team) => {
                
                // Helper to check if a specific checkpoint exists for this team
                const hasCP = (num: number) => team.checkpoints.some((cp: any) => cp.checkpoint_number === num);
                const getCPLink = (num: number) => team.checkpoints.find((cp: any) => cp.checkpoint_number === num)?.github_link;
                
                // Helper for final submission
                const finalSub = team.submissions && team.submissions.length > 0 ? team.submissions[0] : null;

                return (
                  <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Team Info Column */}
                    <td className="p-5">
                      <p className="font-medium text-lg text-blue-100">{team.team_name}</p>
                      <span className="inline-block mt-1 text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded-md border border-blue-500/20">
                        {team.track}
                      </span>
                    </td>

                    {/* Checkpoints Column */}
                    <td className="p-5">
                      <div className="flex gap-4">
                        {[1, 2, 3].map((cpNum) => (
                          <div key={cpNum} className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-gray-500 uppercase">CP {cpNum}</span>
                            {hasCP(cpNum) ? (
                              <a href={getCPLink(cpNum)} target="_blank" rel="noreferrer" title="View GitHub" className="text-emerald-400 hover:text-emerald-300 hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-5 h-5" />
                              </a>
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-700" />
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Final Submission Column */}
                    <td className="p-5">
                      {finalSub ? (
                        <div className="flex flex-col gap-2">
                          <a href={finalSub.final_repo_link} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            <ExternalLink className="w-4 h-4" /> GitHub Repo
                          </a>
                          <a href={finalSub.presentation_link} target="_blank" rel="noreferrer" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                            <ExternalLink className="w-4 h-4" /> Pitch Deck
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600 italic">Not submitted yet</span>
                      )}
                    </td>

                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">No teams found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
// Output: Renders a secure, high-tech admin dashboard fetching joined relational data from Supabase.