// File: src/app/page.tsx
import Link from "next/link";
import { ArrowUpRight, MonitorSmartphone, DatabaseZap, Cpu } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f24] via-[#050814] to-black text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Navigation */}
      <nav className="border-b border-white/5 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-light tracking-widest text-gray-200">
          3IN1<span className="text-blue-500 font-medium">TECH SPRINT</span>
        </div>
        <div className="space-x-6 flex items-center">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            Login
          </Link>
          {/* Reference Button Style: Small */}
          <Link href="/register" className="flex items-center text-sm bg-gradient-to-r from-blue-600 to-blue-800 px-5 py-2 rounded-full font-normal shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:scale-105 transition-all duration-300">
            Register <ArrowUpRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-8 pb-20 text-center flex flex-col items-center">
        
        {/* <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-blue-200 tracking-wide">
          <span className="text-blue-500">✨</span> New! Winners announced at closing ceremony <ArrowUpRight className="w-3 h-3" />
        </div> */}

        <img src="/logo-3in1-tech-sprint.png" alt="3IN1 Tech Sprint" className="mix-blend-screen w-1/4 h-auto" />

        
        {/* Giant Timer Simulation (Like Reference Image) */}
        <div className="text-7xl md:text-9xl font-light tracking-tighter text-white mb-2 drop-shadow-2xl glow-blue-500/50">
          3IN1 Tech Sprint
        </div>
        
        <h1 className="text-xl md:text-3xl font-light tracking-wide text-gray-100 mb-24 leading-tight">
          24 Hours of Innovation. Join us for a weekend of creation, collaboration, and competition.
        </h1>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          {/* Reference Button Style: Large */}
          <Link href="/register" className="flex items-center text-lg bg-gradient-to-r from-[#0033ff] to-[#001188] px-8 py-3 rounded-full font-normal shadow-[0_0_20px_rgba(0,51,255,0.4)] hover:shadow-[0_0_35px_rgba(0,51,255,0.7)] hover:-translate-y-1 transition-all duration-300">
            Register Now! <ArrowUpRight className="ml-2 w-5 h-5" />
          </Link>
          <button className="text-gray-400 hover:text-white font-light tracking-wide transition-colors">
            <a href="https://dsc.gg/3in1techsprint" target="_blank" rel="noopener noreferrer">Join Discord</a>
          </button>
        </div>
      </main>

      {/* Tracks Info Section */}
      <section className="border-t border-white/5 bg-gradient-to-b from-transparent to-black py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-light text-center mb-16 tracking-widest text-gray-300 uppercase">Track Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* UI/UX Card */}
            <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 hover:border-blue-500/50 hover:bg-white/[0.04] transition-all duration-500 group">
              <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MonitorSmartphone className="text-blue-400 w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-normal mb-3 text-gray-100">UI/UX Design</h3>
              <p className="text-gray-400 leading-relaxed font-light text-sm">
                Design intuitive interfaces. Focus on user journey, wireframing, and interactive prototypes.
              </p>
            </div>

            {/* Data Automation Card */}
            <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 hover:border-emerald-500/50 hover:bg-white/[0.04] transition-all duration-500 group">
              <div className="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DatabaseZap className="text-emerald-400 w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-normal mb-3 text-gray-100">Data Automation</h3>
              <p className="text-gray-400 leading-relaxed font-light text-sm">
                Build scripts to process and automate pipelines. Show skills in Python, Node, and data efficiency.
              </p>
            </div>

            {/* System Analyst Card */}
            <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 hover:border-purple-500/50 hover:bg-white/[0.04] transition-all duration-500 group">
              <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="text-purple-400 w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-normal mb-3 text-gray-100">System Analyst</h3>
              <p className="text-gray-400 leading-relaxed font-light text-sm">
                Architect robust systems. Create BRD, SRS, and comprehensive system architecture diagrams.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

// Output: Displays a modern, dark-themed landing page with smooth gradients, elegant thin typography, and glowing pill buttons with Lucide icons.