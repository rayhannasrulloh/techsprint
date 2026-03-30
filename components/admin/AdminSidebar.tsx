// File: src/components/admin/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Megaphone, Mail, LogOut, ShieldAlert, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // State untuk mengontrol buka/tutup sidebar di Mobile
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to sign out from Admin Panel?");
    if (!isConfirmed) return;
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Overview", path: "/admin-secret-panel", icon: LayoutDashboard },
    { name: "Participants", path: "/admin-secret-panel/participants", icon: Users },
    { name: "Announcements", path: "/admin-secret-panel/announcements", icon: Megaphone },
    { name: "Inbox", path: "/admin-secret-panel/inbox", icon: Mail },
  ];

  return (
    <>
      {/* --- MOBILE HEADER (Hanya Muncul di Layar HP) --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#080c1f] border-b border-white/5 sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wider">COMMAND CENTER</h2>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* --- OVERLAY BACKDROP (Hitam Blur di Belakang Menu Mobile) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)} // Tutup jika area gelap diklik
        />
      )}

      {/* --- SIDEBAR UTAMA --- */}
      {/* Di Desktop (md:): Selalu muncul (translate-x-0), posisi relative
        Di Mobile: Posisi fixed, melayang dari kiri, bisa di toggle buka-tutup 
      */}
      <div className={`fixed inset-y-0 left-0 z-[70] w-64 bg-[#080c1f] border-r border-white/5 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Header Sidebar */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold text-white tracking-wider">COMMAND</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Center</p>
            </div>
          </div>
          
          {/* Tombol Close "X" (Hanya muncul di Mobile saat menu terbuka) */}
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white rounded-lg hover:bg-white/5 p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsOpen(false)} // Otomatis menutup sidebar di HP kalau menu diklik
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <item.icon className="w-5 h-5" /> {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Tombol Logout */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>

      </div>
    </>
  );
}