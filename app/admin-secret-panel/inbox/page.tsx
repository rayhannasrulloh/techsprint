// File: src/app/admin-secret-panel/inbox/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mail, ArrowLeft, Search, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const ADMIN_EMAILS = ["rayhan.nasrulloh@student.president.ac.id", "admin@techsprint.web.id"];

export default function AdminInboxPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emails, setEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

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
      setIsLoading(false);
    };
    checkAdmin();
  }, [router]);

  const markAsRead = async (id: string) => {
    await supabase.from('received_emails').update({ is_read: true }).eq('id', id);
    fetchEmails(); // Refresh list silently
  };

  const handleSelectEmail = (email: any) => {
    setSelectedEmail(email);
    if (!email.is_read) markAsRead(email.id);
  };

  if (isLoading) return <div className="min-h-screen bg-[#050814] flex items-center justify-center text-blue-500">Loading Secure Inbox...</div>;

  return (
    <div className="min-h-screen bg-[#050814] text-white p-8 font-sans flex flex-col">
      <div className="max-w-[90rem] mx-auto w-full flex-1 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin-secret-panel" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-light tracking-wide flex items-center gap-3">
                <Mail className="text-blue-500" /> Support Inbox
              </h1>
              <p className="text-gray-400 text-sm mt-1">academic@techsprint.web.id</p>
            </div>
          </div>
        </div>

        {/* Mailbox Container */}
        <div className="flex-1 bg-[#0c122b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex">
          
          {/* Left Panel: Email List */}
          <div className="w-1/3 border-r border-white/10 flex flex-col bg-[#080c1f]">
            <div className="p-4 border-b border-white/10">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search emails..." className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500" />
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
                    className={`w-full text-left p-4 border-b border-white/5 transition-colors hover:bg-white/[0.03] ${selectedEmail?.id === email.id ? 'bg-blue-600/10 border-l-2 border-l-blue-500' : ''} ${!email.is_read ? 'bg-white/[0.02]' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm truncate pr-2 ${!email.is_read ? 'font-medium text-white' : 'font-light text-gray-300'}`}>
                        {email.sender.replace(/<.*>/, '')}
                      </span>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {new Date(email.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={`text-xs truncate mb-1 ${!email.is_read ? 'text-blue-400 font-medium' : 'text-gray-400 font-light'}`}>
                      {email.subject || '(No Subject)'}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Email Content */}
          <div className="flex-1 flex flex-col bg-[#0c122b]">
            {selectedEmail ? (
              <>
                <div className="p-6 border-b border-white/10 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-medium text-white mb-2">{selectedEmail.subject || '(No Subject)'}</h2>
                    <p className="text-sm font-light text-gray-400 flex items-center gap-2">
                      From: <span className="text-blue-400">{selectedEmail.sender}</span>
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
                
                <div className="p-4 border-t border-white/10 bg-[#080c1f] flex gap-3">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
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