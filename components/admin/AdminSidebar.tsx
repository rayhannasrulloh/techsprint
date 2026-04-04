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
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1c1c1c] border-b border-white/10 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-500" />
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">Admin Panel</h2>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
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
      <div className={`fixed inset-y-0 left-0 z-[70] w-64 bg-[#1c1c1c] border-r border-white/10 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Header Sidebar */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-sm font-medium text-gray-200">Admin Panel</h2>
            </div>
          </div>
          
          {/* Tombol Close "X" (Hanya muncul di Mobile saat menu terbuka) */}
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white rounded-md hover:bg-white/5 p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-normal ${
                  isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <item.icon className="w-4 h-4" /> {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Tombol Logout */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-normal"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

      </div>
    </>
  );
}