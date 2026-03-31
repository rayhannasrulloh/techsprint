"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Bell, 
  Map, 
  Flag, 
  UploadCloud, 
  LogOut, 
  Menu,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For Mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // For Desktop

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to sign out?");
    
    if (!isConfirmed) return;

    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: Bell },
    { name: "Timeline", path: "/dashboard/timeline", icon: Map },
    { name: "Checkpoints", path: "/dashboard/checkpoint", icon: Flag },
    { name: "Submission", path: "/dashboard/submission", icon: UploadCloud },
  ];

  if (!isAuthenticated) return <div className="min-h-screen bg-[#050814]"></div>;

  return (
    <div className="mx-auto min-h-screen bg-[#050814] text-white font-sans flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 left-0 h-full bg-[#080c1f] border-r border-white/5 z-50 transition-all duration-300 flex flex-col
          ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          {!isCollapsed ? (
            <div className="text-xl font-light tracking-widest text-gray-200 whitespace-nowrap overflow-hidden">
              <img src="/logo-only.png" alt="Logo" className="w-10" />
            </div>
          ) : (
            <div className="text-xl font-medium text-blue-500 w-full text-center">
              <img src="/logo-only.png" alt="Logo" className="w-10" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-4 flex-1 overflow-y-auto">
          {!isCollapsed && <p className="text-xs font-semibold text-gray-500 tracking-wider mb-4 px-2 mt-2">MENU</p>}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  title={isCollapsed ? item.name : ""}
                  className={`flex items-center rounded-xl transition-all duration-300 font-light text-sm
                    ${isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3"}
                    ${isActive 
                      ? "bg-gradient-to-r from-blue-600/20 to-transparent text-blue-400 border-l-2 border-blue-500" 
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-2 border-transparent"}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-gray-500"}`} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Collapse Button & Logout */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex items-center text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors
              ${isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3 w-full"}
            `}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!isCollapsed && <span className="text-sm font-light">Collapse</span>}
          </button>

          <button 
            onClick={handleLogout}
            className={`flex items-center text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors
              ${isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3 w-full"}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-light">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-[#050814] via-[#0a0f24] to-black">
        
        {/* Top header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-[#050814]/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-300">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block text-sm font-light text-gray-400">
              Pages / <span className="text-gray-100 capitalize">{pathname === '/dashboard' ? 'Overview' : pathname.split('/').pop()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-600/20 to-transparent flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}