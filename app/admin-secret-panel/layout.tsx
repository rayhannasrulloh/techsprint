// File: src/app/admin-secret-panel/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ShieldAlert, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

// 🔒 DAFTAR EMAIL ADMIN YANG DIIZINKAN MASUK (Tetap diexport untuk keperluan filtering di page.tsx)
export const ADMIN_EMAILS = ["rayhan.nasrulloh@student.president.ac.id", "academic@techsprint.web.id"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isRegisterPage = pathname === "/admin-secret-panel/register";

  // Jika halaman registrasi, langsung tampilkan tanpa proteksi
  if (isRegisterPage) {
    return <>{children}</>;
  }
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExists, setSessionExists] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // 1. Pantau perubahan status auth secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth Event:", event);
      
      if (session) {
        setSessionExists(true);
        // Panggil fungsi pengecekan admin dengan mengirimkan session yang ada
        checkAdminClearance(session);
      } else {
        setSessionExists(false);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Perbarui fungsi checkAdmin agar menerima parameter session
  const checkAdminClearance = async (currentSession: any) => {
    try {
      const { data: adminData, error } = await supabase
        .from('admin_profiles')
        .select('status')
        .eq('id', currentSession.user.id)
        .single();

      if (adminData && adminData.status === 'approved') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Error checking clearance:", err);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const toastId = toast.loading("Authenticating Admin...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Cek apakah user ID ada di tabel admin_profiles dan sudah di-approve
      const { data: adminCheck } = await supabase
        .from('admin_profiles')
        .select('id, status')
        .eq('id', data.user.id)
        .single();

      if (adminCheck && adminCheck.status === 'approved') {
        toast.success("Access Granted", { id: toastId });
        // checkAdminClearance dipanggil otomatis via onAuthStateChange
      } else {
        await supabase.auth.signOut();
        toast.error("Access Denied: You are not an approved Admin.", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-emerald-500">Initializing Secure Gateway...</div>;

  if (!sessionExists) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-sm bg-[#1c1c1c] border border-white/10 rounded-xl p-8 shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          <div className="relative z-10 text-center mb-8">
            <h2 className="text-xl text-white tracking-wide">Admin Panel</h2>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-[#121212] border border-white/10 rounded-md p-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" 
                placeholder="Email" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-[#121212] border border-white/10 rounded-md p-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" disabled={isLoggingIn} 
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-all shadow-sm disabled:opacity-50 mt-4"
            >
              {isLoggingIn ? "Authenticating..." : "Authorize Access"} {!isLoggingIn && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (sessionExists && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
        </div>
        <h1 className="text-3xl font-light text-white mb-2">Security Clearance Required</h1>
        <p className="text-gray-400 mb-8 max-w-md">Your current account does not have administrator privileges to access the Command Center.</p>
        <button 
          onClick={async () => { await supabase.auth.signOut(); }} 
          className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-colors text-sm font-medium"
        >
          Sign Out & Return
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171717] text-white flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto h-screen relative">{children}</div>
    </div>
  );
}