"use client";

import Link from "next/link";
import { ArrowLeft, Download, Cpu, Network, ShieldCheck } from "lucide-react";
import Footer from "../../../components/Footer";
import PageLoader from "../../../components/PageLoader";
import { useLang } from "../../../components/LanguageContext";

const translations = {
  en: {
    backHome: "Back to Home",
    heroDesc: "Architect robust systems. Create BRD, SRS, and comprehensive system architecture diagrams. Design the foundational blueprints that shape how technology serves business needs.",
    registerTrack: "Register Track",
    downloadRulebook: "Download Rulebook",

    focus: [
      {
        title: "Architectural Vision",
        desc: "Translate vague business ideas into concrete, actionable system requirements and logic. Form the bridge between management and engineers.",
      },
      {
        title: "Diagramming Mastery",
        desc: "Present complex data flows and logical schemas through industry-standard ERD, UML, and DFD modeling techniques.",
      },
      {
        title: "Feasibility & Risk",
        desc: "A good system isn't just functional; it's scalable and secure. Demonstrate foresight into mitigating risks and future-proofing your designs.",
      },
    ],

    requirementsHeading: "Output",
    requirementsSubheading: "Participants are required to submit output in the following formats:",
    requirements: [
      {
        title: "1. System Architecture Diagram",
        desc: "Visualization of the system structure showing:",
        bullets: [
          "Main system components",
          "Data flow between components",
          "Integration between modules (sales, inventory, restock)",
        ],
      },
      {
        title: "2. End-to-End Workflow",
        desc: "Workflow presented in the form of a flowchart or flow diagram. The system's operational process flow diagram includes:",
        bullets: [
          "Sales transaction process",
          "Automatic stock updates",
          "Stock monitoring",
          "Restocking triggers",
        ],
      },
      {
        title: "3. System Logic Explanation",
        desc: "A narrative explanation of how the system works, including:",
        bullets: [
          "Automatic stock reduction mechanism",
          "Data synchronization",
          "Low stock detection logic",
          "Restock trigger mechanism",
        ],
      },
      {
        title: "4. Trade-Off Analysis",
        desc: "Participants are expected to justify that the designed solution is appropriate for the conditions of MSMEs. Analysis of system design decisions, such as:",
        bullets: [
          "System simplicity vs. complexity",
          "Implementation cost vs. system capability",
          "Level of automation vs. ease of use",
        ],
      },
    ],
  },

  id: {
    backHome: "Kembali ke Beranda",
    heroDesc: "Rancang sistem yang kokoh. Buat BRD, SRS, dan diagram arsitektur sistem yang komprehensif. Desain cetak biru fondasi yang menentukan bagaimana teknologi melayani kebutuhan bisnis.",
    registerTrack: "Daftar Trek",
    downloadRulebook: "Unduh Buku Panduan",

    focus: [
      {
        title: "Visi Arsitektural",
        desc: "Ubah ide bisnis yang samar menjadi persyaratan dan logika sistem yang konkret dan dapat dilaksanakan. Jadilah jembatan antara manajemen dan para insinyur.",
      },
      {
        title: "Penguasaan Diagram",
        desc: "Sajikan alur data yang kompleks dan skema logis melalui teknik pemodelan standar industri seperti ERD, UML, dan DFD.",
      },
      {
        title: "Kelayakan & Risiko",
        desc: "Sistem yang baik bukan hanya fungsional; tetapi juga skalabel dan aman. Tunjukkan wawasan dalam memitigasi risiko dan merancang desain yang tahan masa depan.",
      },
    ],

    requirementsHeading: "Output",
    requirementsSubheading: "Peserta wajib mengumpulkan output dalam format-format berikut ini:",
    requirements: [
      {
        title: "1. Diagram Arsitektur Sistem",
        desc: "Visualisasi struktur sistem yang menampilkan:",
        bullets: [
          "Komponen-komponen utama sistem",
          "Alur data antar komponen",
          "Integrasi antar modul (penjualan, inventaris, restock)",
        ],
      },
      {
        title: "2. Alur Kerja End-to-End",
        desc: "Alur kerja yang disajikan dalam bentuk flowchart atau diagram alir. Diagram alir proses operasional sistem mencakup:",
        bullets: [
          "Proses transaksi penjualan",
          "Pembaruan stok secara otomatis",
          "Pemantauan stok",
          "Pemicu restock",
        ],
      },
      {
        title: "3. Penjelasan Logika Sistem",
        desc: "Penjelasan naratif tentang cara kerja sistem, meliputi:",
        bullets: [
          "Mekanisme pengurangan stok secara otomatis",
          "Sinkronisasi data",
          "Logika deteksi stok rendah",
          "Mekanisme pemicu restock",
        ],
      },
      {
        title: "4. Analisis Trade-Off",
        desc: "Peserta diharapkan dapat membuktikan bahwa solusi yang dirancang sesuai dengan kondisi UMKM. Analisis keputusan desain sistem, seperti:",
        bullets: [
          "Kesederhanaan vs. kompleksitas sistem",
          "Biaya implementasi vs. kemampuan sistem",
          "Tingkat otomasi vs. kemudahan penggunaan",
        ],
      },
    ],
  },
};

export default function SystemAnalystTrackPage() {
  const { lang } = useLang();
  const tx = translations[lang];

  return (
    <div className="min-h-screen bg-[#050814] text-white font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">

      <PageLoader />

      {/* Navigation */}
      <nav className="p-6 w-full absolute top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-light">
            <ArrowLeft className="w-4 h-4" /> {tx.backHome}
          </Link>
          <img src="/logo-techsprint-2026.webp" alt="3IN1 Tech Sprint 2026" className="h-20 w-auto object-contain" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-[#050814] to-[#0a0f24] relative pt-40 pb-20 overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
        <div className="relative z-10 text-center px-6 pt-10 mx-auto">
          <h1 className="text-5xl md:text-[200px] font-bold tracking-[-0.1em] bg-gradient-to-b from-blue-500 to-blue-950/5 bg-clip-text text-transparent mb-6">
            System Analysis
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            {tx.heroDesc}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="px-8 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors">
              {tx.registerTrack}
            </Link>
            <a href="/booklet/SYSTEM-ANALYST-TECH-SPRINT-2026-BOOKLET-PARTICIPANT.pdf" target="_blank" rel="noopener noreferrer" className="relative group p-[2px] rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transition-all inline-flex">
              <span className="flex items-center gap-2 px-8 py-3 bg-black text-white font-medium rounded-full w-full h-full group-hover:bg-black/50 transition-colors duration-300">
                <Download className="w-4 h-4" /> {tx.downloadRulebook}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Key Focus */}
      <section className="py-24 bg-gradient-to-b from-[#0a0f24] via-[#050814] to-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center p-8 bg-gradient-to-b from-blue-500/5 via-[#050814] to-[#0a0f24] rounded-3xl hover:bg-white/[0.04] transition-colors">
            <div className="w-16 h-16 bg-gradient-to-b from-blue-500/20 via-blue-500/5 to-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">{tx.focus[0].title}</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">{tx.focus[0].desc}</p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center p-8 bg-gradient-to-b from-blue-500/5 via-[#050814] to-[#0a0f24] rounded-3xl hover:bg-white/[0.04] transition-colors">
            <div className="w-16 h-16 bg-gradient-to-b from-purple-500/20 via-purple-500/5 to-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
              <Network className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">{tx.focus[1].title}</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">{tx.focus[1].desc}</p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center p-8 bg-gradient-to-b from-blue-500/5 via-[#050814] to-[#0a0f24] rounded-3xl hover:bg-white/[0.04] transition-colors">
            <div className="w-16 h-16 bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">{tx.focus[2].title}</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">{tx.focus[2].desc}</p>
          </div>
        </div>
      </section>

      {/* Track Requirements */}
      <section className="py-24 bg-gradient-to-b from-black via-[#050814] to-[#0a0f24]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold md:text-5xl font-light text-white mb-4">{tx.requirementsHeading}</h2>
            <p className="text-gray-400 font-light">{tx.requirementsSubheading}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {tx.requirements.map((req, idx) => (
              <div key={idx} className="relative flex flex-col bg-white/[0.02] rounded-3xl p-8 transition-transform duration-300 group hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] h-full">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">{req.title}</h3>
                <p className="text-gray-300 font-light text-sm mb-4 leading-relaxed">{req.desc}</p>
                <div className="flex flex-col gap-3 flex-1">
                  {req.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-3 text-sm font-light">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span className="text-gray-400 leading-relaxed">{bullet}</span>
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
