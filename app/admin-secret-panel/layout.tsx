// File: src/app/admin-secret-panel/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";

const ADMIN_EMAILS = ["rayhan.nasrulloh@student.president.ac.id", "admin@techsprint.web.id"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !ADMIN_EMAILS.includes(session.user.email || "")) {
        setIsAdmin(false); setIsLoading(false); return;
      }
      setIsAdmin(true); setIsLoading(false);
    };
    checkAdmin();
  }, [router]);

  if (isLoading) return <div className="min-h-screen bg-[#050814] flex items-center justify-center text-blue-500">Loading Secure Area...</div>;
  if (!isAdmin) return <div className="min-h-screen bg-[#050814] flex items-center justify-center"><h1 className="text-4xl text-red-500">Access Denied</h1></div>;

  return (
    <div className="min-h-screen bg-[#050814] text-white flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto h-screen relative">
        {children}
      </div>
    </div>
  );
}