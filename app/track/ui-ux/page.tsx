import Link from "next/link";
import { ArrowLeft, CheckCircle2, Download, MonitorSmartphone, Target, Layers } from "lucide-react";
import Footer from "../../../components/Footer";
import PageLoader from "../../../components/PageLoader";

export default function UIUXTrackPage() {
  const requirements = [
    {
      title: "Submission",
      items: [
        "Figma Prototype Link",
        "UI Screens (minimum 5 screens)",
        "Problem & Solution Explanation (PDF)",
        "User Flow / Walkthrough Video",
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050814] text-white font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">

      <PageLoader />

      {/* Navigation */}
      <nav className="p-6 w-full absolute top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-light">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <img src="/logo-techsprint-2026.png" alt="3IN1 Tech Sprint 2026" className="h-20 w-auto object-contain" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-[#050814] to-[#0a0f24] relative pt-40 pb-20 overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
        <div className="relative z-10 text-center px-6 pt-10 mx-auto">
          {/* <div className="mx-auto w-20 h-20 bg-gradient-to-b from-blue-500/10 to-blue-950/5 rounded-3xl flex items-center justify-center mb-8">
            <MonitorSmartphone className="text-blue-400 w-10 h-10" />
          </div> */}
          <h1 className="text-5xl md:text-[200px] font-bold tracking-[-0.1em] bg-gradient-to-b from-blue-500 to-blue-950/5 bg-clip-text text-transparent mb-6">
            UI/UX DESIGN
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Design intuitive interfaces. Focus on user journey, wireframing, and interactive prototypes. Shape the future of digital experiences by prioritizing empathy and usability.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="px-8 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors">
              Register Track
            </Link>
            <a href="/UI-UX-DESIGN-TECH-SPRINT-2026-BOOKLET-PARTICIPANT.pdf" target="_blank" rel="noopener noreferrer" className="relative group p-[2px] rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transition-all inline-flex">
              <span className="flex items-center gap-2 px-8 py-3 bg-black text-white font-medium rounded-full w-full h-full group-hover:bg-black/50 transition-colors duration-300">
                <Download className="w-4 h-4" /> Download Rulebook
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* What you will learn / Key Focus */}
      <section className="py-24 bg-gradient-to-b from-[#0a0f24] via-[#050814] to-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center p-8 bg-gradient-to-b from-blue-500/5 via-[#050814] to-[#0a0f24] rounded-3xl hover:bg-white/[0.04] transition-colors">
            <div className="w-16 h-16 bg-gradient-to-b from-blue-500/20 via-blue-500/5 to-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">User-Centered Focus</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">Empathize with users to solve real problems. Show your research, personas, and exactly how your design addresses core user pain points.</p>
          </div>

          <div className="flex flex-col items-center text-center p-8 bg-gradient-to-b from-blue-500/5 via-[#050814] to-[#0a0f24] rounded-3xl hover:bg-white/[0.04] transition-colors">
            <div className="w-16 h-16 bg-gradient-to-b from-purple-500/20 via-purple-500/5 to-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Seamless Prototyping</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">Translate ideas into tangible, clickable prototypes. Judges look for smooth transitions, logical flows, and high-fidelity aesthetics.</p>
          </div>

          <div className="flex flex-col items-center text-center p-8 bg-gradient-to-b from-blue-500/5 via-[#050814] to-[#0a0f24] rounded-3xl hover:bg-white/[0.04] transition-colors">
            <div className="w-16 h-16 bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Pitch & Delivery</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">It's not just about how it looks, but how you sell it. Pitch your product effectively to stakeholders highlighting business and user value.</p>
          </div>
        </div>
      </section>

      {/* Track Requirements */}
      <section className="py-24 bg-gradient-to-b from-black via-[#050814] to-[#0a0f24]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold md:text-5xl font-light text-white mb-4">Submission Requirements</h2>
            <p className="text-gray-400 font-light">Make sure to submit all these deliverables to qualify for the final judging phase.</p>
          </div>

          <div className="max-w-2xl mx-auto w-full gap-8 grid items-start">
            {requirements.map((req, idx) => (
              <div key={idx} className={`relative flex flex-col bg-white/[0.02] rounded-3xl p-8 transition-transform duration-300 group hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]`}>
                <h3 className={`text-xl font-medium tracking-widest mb-6 text-blue-400 uppercase`}>{req.title}</h3>
                
                <div className="flex flex-col gap-4 flex-1">
                  {req.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-start gap-4 text-sm font-light">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      <span className="text-gray-300 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
