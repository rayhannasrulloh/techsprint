// File: src/app/admin-secret-panel/inbox/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mail, ArrowLeft, Search, Trash2, CheckCircle2, Send, Pencil, Users, User, Type } from "lucide-react";
import Link from "next/link";

const ADMIN_EMAILS = ["rayhan.nasrulloh@student.president.ac.id", "academic@techsprint.web.id"];

export default function AdminInboxPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emails, setEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  // Compose states
  const [isComposing, setIsComposing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recipientMode, setRecipientMode] = useState<'all' | 'team' | 'custom'>('all');
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [teams, setTeams] = useState<any[]>([]);

  const fetchEmails = async () => {
    const { data, error } = await supabase
      .from('received_emails')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setEmails(data);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !ADMIN_EMAILS.includes(session.user.email || "")) {
        router.push("/login");
        return;
      }
      setIsAdmin(true);
      await fetchEmails();
      
      // Fetch teams for broadcast selection
      const { data: teamsData } = await supabase.from('teams').select('id, team_name, leader_email, track').order('team_name');
      if (teamsData) setTeams(teamsData);
      
      setIsLoading(false);
    };
    checkAdmin();
  }, [router]);

  const markAsRead = async (id: string) => {
    await supabase.from('received_emails').update({ is_read: true }).eq('id', id);
    fetchEmails(); // Refresh list silently
  };

  const handleSelectEmail = (email: any) => {
    setIsComposing(false);
    setSelectedEmail(email);
    if (!email.is_read) markAsRead(email.id);
  };

  const handleSendEmail = async () => {
    if (!composeData.subject || !composeData.message) {
      alert("Subject and Message are required!");
      return;
    }

    let recipients: string[] = [];
    if (recipientMode === 'all') {
      recipients = teams.map(t => t.leader_email).filter(Boolean);
      if (!confirm(`Are you sure you want to broadcast this email to ${recipients.length} teams?`)) return;
    } else if (recipientMode === 'team') {
      if (!composeData.to) { alert("Please select a team!"); return; }
      recipients = [composeData.to];
    } else if (recipientMode === 'custom') {
      if (!composeData.to) { alert("Please enter an email address!"); return; }
      recipients = composeData.to.split(',').map(e => e.trim()).filter(Boolean);
    }

    if (recipients.length === 0) {
      alert("No valid recipients found.");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipients,
          subject: composeData.subject,
          text: composeData.message, // Plain text fallback
          html: composeData.message.replace(/\n/g, '<br/>') // Basic HTML
        })
      });

      if (res.ok) {
        alert("Email(s) sent successfully!");
        setIsComposing(false);
        setComposeData({ to: '', subject: '', message: '' });
      } else {
        const err = await res.json();
        alert(`Failed to send email: ${err.error || err.message}`);
      }
    } catch (error: any) {
      alert(`Error sending email: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-emerald-500">Loading Secure Inbox...</div>;

  return (
    <div className="max-w-[90rem] mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
      <div className="w-full flex-1 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-medium flex items-center gap-3">
                Support Inbox
              </h1>
              <p className="text-sm text-gray-400 mt-1">academic@techsprint.web.id</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsComposing(true); setSelectedEmail(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <Pencil className="w-4 h-4" /> Compose Email
          </button>
        </div>

        {/* Mailbox Container */}
        <div className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-xl overflow-hidden shadow-sm flex">

          {/* Left Panel: Email List */}
          <div className="w-1/3 border-r border-white/10 flex flex-col bg-[#1c1c1c]/50">
            <div className="p-4 border-b border-white/10">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search emails..." className="w-full bg-[#121212] border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {emails.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm font-light">No emails received yet.</div>
              ) : (
                emails.map((email) => (
                  <button
                    key={email.id}
                    onClick={() => handleSelectEmail(email)}
                    className={`w-full text-left p-4 border-b border-white/5 transition-colors hover:bg-white/[0.03] ${selectedEmail?.id === email.id ? 'bg-[#2e2e2e] border-l-2 border-l-emerald-500' : ''} ${!email.is_read ? 'bg-white/[0.02]' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm truncate pr-2 ${!email.is_read ? 'font-medium text-white' : 'font-normal text-gray-300'}`}>
                        {email.sender.replace(/<.*>/, '')}
                      </span>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {new Date(email.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={`text-xs truncate mb-1 ${!email.is_read ? 'text-emerald-400 font-medium' : 'text-gray-400 font-normal'}`}>
                      {email.subject || '(No Subject)'}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Email Content or Compose */}
          <div className="flex-1 flex flex-col bg-[#1c1c1c]">
            {isComposing ? (
              <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#252525]">
                  <h2 className="text-xl font-medium text-white flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-emerald-500" /> New Email Message
                  </h2>
                  <button onClick={() => setIsComposing(false)} className="text-gray-400 hover:text-white transition-colors">
                    Cancel
                  </button>
                </div>
                
                <div className="p-8 flex-1 flex flex-col gap-5">
                  {/* Recipient Mode */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Recipient Mode</label>
                    <div className="flex gap-3">
                      <button onClick={() => setRecipientMode('all')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors border ${recipientMode === 'all' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#2a2a2a] border-white/10 text-gray-300 hover:bg-[#333]'}`}>
                        <Users className="w-4 h-4" /> Broadcast (All Teams)
                      </button>
                      <button onClick={() => setRecipientMode('team')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors border ${recipientMode === 'team' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#2a2a2a] border-white/10 text-gray-300 hover:bg-[#333]'}`}>
                        <User className="w-4 h-4" /> Specific Team
                      </button>
                      <button onClick={() => setRecipientMode('custom')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors border ${recipientMode === 'custom' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#2a2a2a] border-white/10 text-gray-300 hover:bg-[#333]'}`}>
                        <Type className="w-4 h-4" /> Custom Email
                      </button>
                    </div>
                  </div>

                  {/* To Field */}
                  {recipientMode === 'all' && (
                    <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-md text-sm border border-emerald-500/20">
                      This will send an email to all {teams.length} registered teams.
                    </div>
                  )}

                  {recipientMode === 'team' && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-400">Select Team</label>
                      <select 
                        value={composeData.to} 
                        onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                        className="w-full bg-[#121212] border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="">-- Select a Team --</option>
                        {teams.map(t => (
                          <option key={t.id} value={t.leader_email}>{t.team_name} ({t.track}) - {t.leader_email}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {recipientMode === 'custom' && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-400">Email Address(es)</label>
                      <input 
                        type="text" 
                        value={composeData.to} 
                        onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                        placeholder="john@example.com, jane@example.com"
                        className="w-full bg-[#121212] border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  )}

                  {/* Subject Field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Subject</label>
                    <input 
                      type="text" 
                      value={composeData.subject} 
                      onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                      placeholder="Email Subject"
                      className="w-full bg-[#121212] border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-medium text-gray-400">Message</label>
                    <textarea 
                      value={composeData.message} 
                      onChange={(e) => setComposeData({...composeData, message: e.target.value})}
                      placeholder="Write your email message here..."
                      className="w-full flex-1 bg-[#121212] border border-white/10 rounded-md py-3 px-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none min-h-[250px]"
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-[#121212] flex justify-end gap-3">
                  <button onClick={() => setIsComposing(false)} className="px-4 py-2 border border-white/10 hover:bg-white/5 text-white rounded-md text-sm font-medium transition-colors">
                    Discard
                  </button>
                  <button 
                    onClick={handleSendEmail} 
                    disabled={isSending}
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
                  >
                    {isSending ? (
                      <>Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Email</>
                    )}
                  </button>
                </div>
              </div>
            ) : selectedEmail ? (
              <>
                <div className="p-6 border-b border-white/10 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-medium text-white mb-2">{selectedEmail.subject || '(No Subject)'}</h2>
                    <p className="text-sm font-normal text-gray-400 flex items-center gap-2">
                      From: <span className="text-emerald-400">{selectedEmail.sender}</span>
                    </p>
                    <p className="text-xs font-light text-gray-500 mt-1">
                      Date: {new Date(selectedEmail.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                  {selectedEmail.html_body ? (
                    /* Render HTML Email with a safe white background */
                    <div
                      className="bg-white text-black p-6 rounded-xl text-sm leading-relaxed shadow-inner overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.html_body }}
                    />
                  ) : (
                    /* Fallback to Plain Text */
                    <div className="text-gray-300 font-light text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedEmail.text_body || "No content available."}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-[#121212] flex gap-3">
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm">
                    Reply (via Mail Client)
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Mail className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-light">Select an email to read</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Output: Displays a secure inbox UI, fetching from received_emails, with left/right split view.