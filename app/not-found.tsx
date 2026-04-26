import Link from "next/link";
import { ArrowLeft, Ban } from "lucide-react";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050814] text-white font-sans selection:bg-blue-500 selection:text-white flex flex-col overflow-hidden">
      
      {/* Navigation - Minimal */}
      <nav className="p-6 w-full absolute top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-light">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <img src="/logo-techsprint-2026.webp" alt="3IN1 Tech Sprint 2026" className="h-20 w-auto object-contain" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative bg-gradient-to-b from-black via-[#050814] to-[#0a0f24] px-6">
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Glitchy or Big 404 Text */}
          <div className="relative mb-6">
            <h1 className="text-8xl md:text-[150px] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
              404
            </h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-medium text-gray-200 mb-4">
            Sorry, the page you are looking for doesn't exist.
          </h2>
          
          <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed max-w-md mx-auto mb-10">
            The requested sector doesn't exist in our current database. It may have been moved, deleted, or never deployed in this timeline.
          </p>

          <Link 
            href="/" 
            className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Base
          </Link>
        </div>
      </main>
    </div>
  );
}
