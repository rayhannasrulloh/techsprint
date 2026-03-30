// File: src/app/admin-secret-panel/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ShieldAlert, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

// 🔒 DAFTAR EMAIL ADMIN YANG DIIZINKAN MASUK
const ADMIN_EMAILS = ["rayhan.nasrulloh@student.president.ac.id", "admin@techsprint.web.id"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExists, setSessionExists] = useState(false);

  // State untuk Form Login Admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setSessionExists(false);
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }
    
    setSessionExists(true);
    if (ADMIN_EMAILS.includes(session.user.email || "")) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAdmin();
  }, [router]);

  // Fungsi Login Khusus Admin
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const toastId = toast.loading("Verifying security clearance...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Cek apakah email yang login ada di daftar ADMIN_EMAILS
      if (data.user && ADMIN_EMAILS.includes(data.user.email || "")) {
        toast.success("Welcome to Command Center", { id: toastId });
        checkAdmin(); // Refresh state agar gerbang terbuka
      } else {
        // Jika login sukses tapi BUKAN admin (peserta nyasar)
        await supabase.auth.signOut();
        toast.error("Unauthorized. Admin clearance required.", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#050814] flex items-center justify-center text-blue-500">Initializing Secure Gateway...</div>;

  // --- KONDISI 1: BELUM LOGIN SAMA SEKALI (TAMPILKAN FORM LOGIN ADMIN) ---
  if (!sessionExists) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-md bg-[#0c122b] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          {/* Efek Glow Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <ShieldAlert className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-light text-white tracking-wide">Command Center</h2>
            <p className="text-gray-400 text-xs tracking-widest uppercase mt-2">Restricted Access Portal</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Admin Email</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-[#050814] border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors" 
                placeholder="admin@techsprint.web.id" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Security Key (Password)</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-[#050814] border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" disabled={isLoggingIn} 
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 mt-4"
            >
              {isLoggingIn ? "Authenticating..." : "Authorize Access"} {!isLoggingIn && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- KONDISI 2: SUDAH LOGIN TAPI BUKAN ADMIN (Peserta yang coba-coba akses URL) ---
  if (sessionExists && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
        </div>
        <h1 className="text-3xl font-light text-white mb-2">Security Clearance Required</h1>
        <p className="text-gray-400 mb-8 max-w-md">Your current account does not have administrator privileges to access the Command Center.</p>
        <button 
          onClick={async () => { await supabase.auth.signOut(); checkAdmin(); }} 
          className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-colors text-sm font-medium"
        >
          Sign Out & Return
        </button>
      </div>
    );
  }

  // --- KONDISI 3: LOGIN SUKSES SEBAGAI ADMIN (Tampilkan Dashboard) ---
  return (
    <div className="min-h-screen bg-[#050814] text-white flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto h-screen relative">
        {children}
      </div>
    </div>
  );
}