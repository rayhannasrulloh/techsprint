"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import { TextReveal } from "../components/TextReveal";
import { Typewriter } from "../components/Typewriter";
import MagicBento from "../components/MagicBento";
import MagicTimeline from "../components/MagicTimeline";
import FaultyTerminal from "../components/FaultyTerminal";
import NumberTicker from "../components/NumberTicker";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Countdown from "../components/Countdown";
import PageLoader from "../components/PageLoader";
import { useLang } from "../components/LanguageContext";
import {
  ArrowUpRight, ArrowRight, MonitorSmartphone, DatabaseZap, Cpu, Calendar,
  UserPlus, Timer, MonitorPlay, Rocket,
  Mail, MapPin, MessageSquare, Instagram, Twitter, Linkedin
} from "lucide-react";

// ─── Translation strings ────────────────────────────────────────────────────
const translations = {
  en: {
    // Nav
    navUiUx: "UI/UX Design",
    navDataAuto: "Data Automation",
    navSystemAnalyst: "System Analyst",
    navLogin: "Login",
    navRegister: "Register",
    navDashboard: "Dashboard",

    // Hero
    typewriterLines: [
      "Early Bird Registration is Closed!",
      "Normal Batch Registration is Open!",
    ],
    typewriterMobile: "Normal Registration is Open!",
    heroPrimary: "Register Now!",
    heroSecondary: "Learn More",

    // About
    aboutHeading: "Ready to Innovate, Create the Future State",
    aboutP1: (
      <>
        Tech Sprint 2026 - <span className="text-blue-600 dark:text-gray-200 font-bold dark:font-normal">3IN1</span> is the flagship innovation competition organized by the Research and Development (R&D) Division of the President University Major Association of Information Systems (PUMA IS). Building on the prestigious legacy of previous iterations, evolving from CompClub (2021–2023) to the international Golden Code Hackathon in 2025, this year&apos;s event is designed as an intensive 2-day innovation sprint. With a core philosophy of <span className="text-black dark:text-white font-bold dark:font-medium">&quot;Tech With Impact,&quot;</span> rooted in the philosophy of <span className="text-black dark:text-white font-bold dark:font-medium">THINK, BUILD,</span> and <span className="text-black dark:text-white font-bold dark:font-medium">IMPACT</span>, the sprint challenges participants to move from analytical thinking (THINK) to hands-on prototyping (BUILD) to deliver measurable real-world implementation (IMPACT).
      </>
    ),
    aboutP2: (
      <>
        Carrying the mission to create sustainable tech solutions addressing real campus and student challenges, the event introduces a unique approach across three specialized tracks: <span className="text-blue-600 dark:text-gray-200 font-bold dark:font-normal">UI/UX Design, Data Automation, and System Analysis</span>. Each track targets 8 competing teams, bringing together a total of 72 participants across all three tracks. The sprint unfolds in two structured phases: <span className="text-black dark:text-white font-bold dark:font-medium">Day 1 (BUILD)</span>, where teams ideate and rapidly prototype their solutions, and <span className="text-black dark:text-white font-bold dark:font-medium">Day 2 (TEST + PITCH)</span>, where top teams present their final outputs to a panel of industry judges.
      </>
    ),

    // Mascot
    mascotLabel: "Official Mascot",
    mascotBio: (
      <>
        Born in the digital halls of <span className="text-blue-600 dark:text-blue-400 font-bold dark:font-medium">PUMA IS</span>, Mr. SPRINT is not just an ordinary robot. Mr. SPRINT is a sharp, suit-up robot built to assist your innovation, and embodies the spirit of the modern tech. Mr. SPRINT represents every student who dares to <span className="text-black dark:text-white font-bold dark:font-semibold">THINK</span> beyond the room, <span className="text-black dark:text-white font-bold dark:font-semibold">BUILD</span> something real, and create <span className="text-black dark:text-white font-bold dark:font-semibold">IMPACT</span> that matters. Mr. SPRINT&apos;s glowing eyes represent clarity of vision, and Mr. SPRINT dressed for success with a mind wired for problem-solving.
      </>
    ),
    mascotQuote: (
      <>
        In a world where innovation moves fast, Mr. SPRINT reminds us that every big impact starts with the courage to take the first step.{" "}
        <span className="text-blue-600 dark:text-blue-400 font-bold dark:font-semibold">The SPRINT starts now!</span>
      </>
    ),
    mascotTagline: "The official mascot of Tech Sprint '26 is now here.",

    // Timeline
    timelineHeading: "Event Journey",
    timelineSubheading: "Mark your calendar for these important dates.",
    timelineEvents: [
      { date: "6 – 12 April 2026", title: "Early Bird", desc: "Open registration for early birds. Gather your team of 3 and secure your spot early." },
      { date: "13 – 26 April 2026", title: "Normal Batch Registration", desc: "Last chance to join!" },
      { date: "6 May 2026", title: "Technical Meeting", desc: "Mandatory briefing for all participants. We will discuss rules, submission guidelines, and judging criteria." },
      { date: "9 – 10 May 2026", title: "Competition Day", desc: "The sprint begins! Starts at 12:00 PM and ends the next day at 12:00 PM. Build your solutions and conquer the checkpoints." },
    ],

    // Tracks
    tracksHeading: "Track Categories",
    trackCards: [
      { title: "UI/UX Design", description: "Design intuitive interfaces. Craft compelling user experiences and stunning prototypes." },
      { title: "Data Automation", description: "Streamline workflows. Build intelligent scripts and automate data processing pipelines." },
      { title: "System Analysis", description: "Architect robust systems. Create BRD, SRS, and comprehensive system architecture diagrams." },
    ],
    trackCta: "Learn More",

    // Sponsors
    sponsorsHeading: "Sponsored by",
    becomeSponsort: "Become a sponsor",
  },

  id: {
    // Nav
    navUiUx: "UI/UX Design",
    navDataAuto: "Data Automation",
    navSystemAnalyst: "System Analyst",
    navLogin: "Masuk",
    navRegister: "Daftar",
    navDashboard: "Dasbor",

    // Hero
    typewriterLines: [
      "Pendaftaran Early Bird Telah Ditutup!",
      "Pendaftaran Batch Normal Kini Dibuka!",
    ],
    typewriterMobile: "Pendaftaran Normal Kini Dibuka!",
    heroPrimary: "Daftar Sekarang!",
    heroSecondary: "Pelajari Lebih Lanjut",

    // About
    aboutHeading: "Siap Berinovasi, Ciptakan Masa Depan",
    aboutP1: (
      <>
        Tech Sprint 2026 - <span className="text-blue-600 dark:text-gray-200 font-bold dark:font-normal">3IN1</span> adalah kompetisi inovasi unggulan yang diselenggarakan oleh Divisi Riset dan Pengembangan (R&D) dari Asosiasi Jurusan Sistem Informasi President University (PUMA IS). Melanjutkan warisan bergengsi dari edisi sebelumnya, yang berkembang dari CompClub (2021–2023) hingga Golden Code Hackathon internasional pada tahun 2025, acara tahun ini dirancang sebagai sprint inovasi intensif selama 2 hari. Dengan filosofi utama <span className="text-black dark:text-white font-bold dark:font-medium">&quot;Tech With Impact,&quot;</span> yang berakar pada filosofi <span className="text-black dark:text-white font-bold dark:font-medium">THINK, BUILD,</span> dan <span className="text-black dark:text-white font-bold dark:font-medium">IMPACT</span>, sprint ini menantang peserta untuk bergerak dari pemikiran analitis (THINK) menuju prototyping langsung (BUILD) hingga menghasilkan implementasi nyata yang terukur (IMPACT).
      </>
    ),
    aboutP2: (
      <>
        Mengemban misi menciptakan solusi teknologi berkelanjutan untuk tantangan nyata di kampus dan kehidupan mahasiswa, acara ini menghadirkan pendekatan unik melalui tiga trek khusus: <span className="text-blue-600 dark:text-gray-200 font-bold dark:font-normal">UI/UX Design, Data Automation, dan System Analysis</span>. Setiap trek menargetkan 8 tim yang bersaing, dengan total 72 peserta dari ketiga trek. Sprint berlangsung dalam dua fase terstruktur: <span className="text-black dark:text-white font-bold dark:font-medium">Hari 1 (BUILD)</span>, di mana tim mengembangkan ide dan membuat prototipe secara cepat, dan <span className="text-black dark:text-white font-bold dark:font-medium">Hari 2 (TEST + PITCH)</span>, di mana tim terbaik mempresentasikan hasil akhir kepada panel juri industri.
      </>
    ),

    // Mascot
    mascotLabel: "Maskot Resmi",
    mascotBio: (
      <>
        Lahir di koridor digital <span className="text-blue-600 dark:text-blue-400 font-bold dark:font-medium">PUMA IS</span>, Mr. SPRINT bukan sekadar robot biasa. Mr. SPRINT adalah robot berjas yang tajam, dibangun untuk mendukung inovasimu, dan mewujudkan semangat teknologi modern. Mr. SPRINT mewakili setiap mahasiswa yang berani <span className="text-black dark:text-white font-bold dark:font-semibold">BERPIKIR</span> melampaui batas, <span className="text-black dark:text-white font-bold dark:font-semibold">MEMBANGUN</span> sesuatu yang nyata, dan menciptakan <span className="text-black dark:text-white font-bold dark:font-semibold">DAMPAK</span> yang berarti. Mata Mr. SPRINT yang bercahaya melambangkan kejelasan visi, dan penampilannya yang rapi mencerminkan pikiran yang terprogram untuk memecahkan masalah.
      </>
    ),
    mascotQuote: (
      <>
        Di dunia yang bergerak cepat, Mr. SPRINT mengingatkan kita bahwa setiap dampak besar dimulai dari keberanian untuk mengambil langkah pertama.{" "}
        <span className="text-blue-600 dark:text-blue-400 font-bold dark:font-semibold">SPRINT dimulai sekarang!</span>
      </>
    ),
    mascotTagline: "Maskot resmi Tech Sprint '26 kini telah hadir.",

    // Timeline
    timelineHeading: "Perjalanan Acara",
    timelineSubheading: "Tandai tanggal-tanggal penting berikut di kalendermu.",
    timelineEvents: [
      { date: "6 – 12 April 2026", title: "Early Bird", desc: "Pendaftaran dibuka untuk early bird. Kumpulkan tim beranggotakan 3 orang dan amankan tempatmu lebih awal." },
      { date: "13 – 26 April 2026", title: "Pendaftaran Batch Normal", desc: "Kesempatan terakhir untuk bergabung!" },
      { date: "6 Mei 2026", title: "Technical Meeting", desc: "Briefing wajib bagi seluruh peserta. Kami akan membahas peraturan, panduan pengumpulan tugas, dan kriteria penilaian." },
      { date: "9 – 10 Mei 2026", title: "Hari Kompetisi", desc: "Sprint dimulai! Mulai pukul 12.00 siang dan berakhir keesokan harinya pukul 12.00 siang. Kembangkan solusimu dan taklukkan setiap checkpoint." },
    ],

    // Tracks
    tracksHeading: "Kategori Trek",
    trackCards: [
      { title: "UI/UX Design", description: "Rancang antarmuka yang intuitif. Ciptakan pengalaman pengguna yang memikat dan prototipe yang memukau." },
      { title: "Data Automation", description: "Optimalkan alur kerja. Bangun skrip cerdas dan otomasi pipeline pemrosesan data." },
      { title: "System Analysis", description: "Rancang sistem yang kokoh. Buat BRD, SRS, dan diagram arsitektur sistem yang komprehensif." },
    ],
    trackCta: "Pelajari Lebih Lanjut",

    // Sponsors
    sponsorsHeading: "Disponsori oleh",
    becomeSponsort: "Jadilah sponsor",
  },
};

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { resolvedTheme } = useTheme();
  const { lang } = useLang();

  const tx = translations[lang];

  useEffect(() => {
    setMounted(true);
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      }
    };
    checkUser();

    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Data Track — rebuilt from translations
  const trackCards = tx.trackCards.map((card, i) => {
    const icons = [
      <div key="uiux" className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><MonitorSmartphone className="text-blue-500 w-7 h-7 stroke-[1.5]" /></div>,
      <div key="data" className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><DatabaseZap className="text-blue-500 w-7 h-7 stroke-[1.5]" /></div>,
      <div key="sys" className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Cpu className="text-blue-500 w-7 h-7 stroke-[1.5]" /></div>,
    ];
    const hrefs = ['/track/ui-ux', '/track/data-automation', '/track/system-analyst'];
    return {
      href: hrefs[i],
      title: card.title,
      description: card.description,
      icon: icons[i],
      className: "group",
      color: 'rgba(255,255,255,0.02)',
      cta: <span className="inline-flex items-center text-sm font-bold dark:font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform duration-300">{tx.trackCta} <ArrowRight className="ml-2 w-4 h-4" /></span>,
    };
  });

  // Data Timeline Event
  const timelineIcons = [UserPlus, Timer, MonitorPlay, Rocket];
  const serializedTimelineEvents = tx.timelineEvents.map((item, i) => {
    const Icon = timelineIcons[i];
    return {
      date: item.date,
      title: item.title,
      desc: item.desc,
      color: "text-blue-400",
      nodeMarker: (
        <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-900/10 border-blue-900/10 border rounded-full flex items-center justify-center">
          <Icon className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
        </div>
      ),
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent dark:bg-gradient-to-b dark:from-[#0a0f24] dark:via-[#050814] dark:to-black text-gray-900 dark:text-white font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden relative transition-colors duration-500">

      {/* Unified Faulty Terminal Background Layer (Dark Mode Only) */}
      {mounted && resolvedTheme === 'dark' && !isMobile && (
        <div className="fixed inset-0 z-0 pointer-events-auto mix-blend-screen transition-all">
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={0.5}
            pause={false}
            scanlineIntensity={0.5}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0.1}
            tint="#051e3652"
            mouseReact={true}
            mouseStrength={0.5}
            pageLoadAnimation={true}
            brightness={0.1}
          />
        </div>
      )}

      <PageLoader />

      {/* Hero Content Wrapper */}
      <div className="relative w-full min-h-screen flex flex-col z-10 pointer-events-none">

        {/* Foreground Layer (Nav + Hero) */}
        <div className="relative z-10 flex-1 flex flex-col pointer-events-none">
          {/* Navigation */}
          <nav className="border-black/5 dark:border-white/5 p-6 flex justify-between items-center max-w-7xl mx-auto w-full pointer-events-auto transition-colors">

            <div className="flex-1 flex items-center justify-start">
              <Link href="/">
                <img src="/logo-only.webp" alt="3IN1 Tech Sprint 2026" className="h-18 md:h-18 w-auto object-contain dark:mix-blend-screen transition-all" />
              </Link>
            </div>

            <div className="hidden md:flex flex-1 items-center justify-center gap-8">
              <Link href="/track/ui-ux" className="text-sm font-medium text-black hover:text-blue-600 dark:font-light dark:text-gray-300 dark:hover:text-white transition-colors tracking-wide">{tx.navUiUx}</Link>
              <Link href="/track/data-automation" className="text-sm font-medium text-black hover:text-blue-600 dark:font-light dark:text-gray-300 dark:hover:text-white transition-colors tracking-wide">{tx.navDataAuto}</Link>
              <Link href="/track/system-analyst" className="text-sm font-medium text-black hover:text-blue-600 dark:font-light dark:text-gray-300 dark:hover:text-white transition-colors tracking-wide">{tx.navSystemAnalyst}</Link>
            </div>

            <div className="flex-1 flex justify-end space-x-2 md:space-x-6 items-center">

              {/* Authentication Info / App Entry */}
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <a href="https://www.instagram.com/techsprint26/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-black hover:text-blue-600 dark:font-light dark:text-gray-300 dark:hover:text-white transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <Link href="/dashboard" aria-describedby="Masuk ke Dashboard anda" className="flex items-center text-sm bg-blue-600 text-white px-5 py-2 rounded-full font-medium shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:scale-105 transition-all duration-300">
                    {tx.navDashboard}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-medium text-black hover:text-blue-600 dark:font-light dark:text-gray-300 dark:hover:text-white transition-colors">
                    {tx.navLogin}
                  </Link>
                  <Link href="/register" className="flex items-center text-sm bg-blue-600 text-white px-5 py-2 rounded-full font-medium dark:hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] dark:hover:scale-105 transition-all duration-300">
                    {tx.navRegister} <ArrowUpRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Hero Section */}
          <main className="max-w-7xl mx-auto px-6 pt-12 pb-20 flex flex-col md:flex-row items-center justify-between w-full flex-1 pointer-events-auto gap-12 md:gap-8">

            {/* Left Column (Text, Countdown, Buttons) */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 z-10">

              {/* Countdown Timer */}
              <div
                className="flex flex-col items-center md:items-start text-4xl md:text-12xl font-bold dark:font-normal tracking-wide text-black dark:text-white mb-10 leading-tight transition-colors"
                style={{ textShadow: mounted && resolvedTheme !== 'dark' ? "none" : "0 0 3px rgba(255, 255, 255, 1), 0 0 6px rgba(40, 85, 124, 0.8), 0 0 9px rgba(67, 83, 207, 0.6)" }}
              >
                {mounted && !isMobile ? (
                  <Typewriter
                    text={tx.typewriterLines}
                    delay={1.8}
                    speed={0.05}
                    pauseBetween={2500}
                    className="inline-block mb-6 text-xl md:text-2xl h-8 text-center md:text-left"
                  />
                ) : (
                  <span className="inline-block mb-6 text-xl md:text-2xl text-center md:text-left h-8">{tx.typewriterMobile}</span>
                )}
                <Countdown targetDate="2026-04-26T23:59:59" />
              </div>

              <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-6 mt-4">
                {/* Reference Button Style: Large */}
                <Link
                  href="/register"
                  className="flex items-center text-white text-lg bg-gradient-to-r from-[#0033ff] to-[#001188] px-8 py-3 rounded-full font-normal dark:shadow-[0_0_20px_rgba(0,51,255,0.4)] dark:hover:shadow-[0_0_35px_rgba(0,51,255,0.7)] transition-all duration-300">
                  {tx.heroPrimary} <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-black hover:text-blue-600 font-medium dark:text-gray-400 dark:hover:text-white dark:font-light tracking-wide transition-colors"
                >
                  {tx.heroSecondary}
                </button>
              </div>
            </div>

            {/* Right Column (Glitch Logo) */}
            <div className="md:w-1/2 flex justify-center items-center mt-12 md:mt-0 relative group z-10 w-full max-w-sm md:max-w-md lg:max-w-lg">
              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes continuousGlitch {
                  0% { transform: translate(0) scale(1); filter: drop-shadow(0 0 0 transparent); }
                  2% { transform: translate(-4px, 3px) scale(1.02); filter: drop-shadow(-3px 0 0 rgba(59,130,246,0.7)) drop-shadow(3px 0 0 rgba(147,197,253,0.7)); }
                  4% { transform: translate(4px, -3px) scale(0.98); filter: drop-shadow(3px 0 0 rgba(59,130,246,0.5)) drop-shadow(-3px 0 0 rgba(147,197,253,0.5)); }
                  6% { transform: translate(0) scale(1); filter: drop-shadow(0 0 0 transparent); }
                  50% { transform: translate(0) scale(1); filter: drop-shadow(0 0 0 transparent); }
                  52% { transform: translate(-3px, -4px) scale(1.01); filter: drop-shadow(3px 3px 0 rgba(59,130,246,0.8)) drop-shadow(-3px -3px 0 rgba(147,197,253,0.8)); }
                  54% { transform: translate(3px, 4px) scale(0.99); filter: drop-shadow(-3px -3px 0 rgba(59,130,246,0.6)) drop-shadow(3px 3px 0 rgba(147,197,253,0.6)); }
                  56% { transform: translate(0) scale(1); filter: drop-shadow(0 0 0 transparent); }
                  80% { transform: translate(0) scale(1); filter: drop-shadow(0 0 0 transparent); }
                  81% { transform: translate(-1px, 1px) scale(1); filter: drop-shadow(-1px 0 0 rgba(59,130,246,0.4)) drop-shadow(1px 0 0 rgba(147,197,253,0.4)); }
                  82% { transform: translate(1px, -1px) scale(1); filter: drop-shadow(1px 0 0 rgba(59,130,246,0.4)) drop-shadow(-1px 0 0 rgba(147,197,253,0.4)); }
                  83% { transform: translate(0) scale(1); filter: drop-shadow(0 0 0 transparent); }
                  100% { transform: translate(0) scale(1); filter: drop-shadow(0 0 0 transparent); }
                }
                .glitch-logo {
                  animation: continuousGlitch 4s infinite;
                  transform-style: preserve-3d;
                }
              `}} />
              <img
                src="/logo-techsprint-2026.webp"
                alt="3IN1 Tech Sprint 2026"
                className="w-full h-auto object-contain dark:mix-blend-screen glitch-logo drop-shadow-[0_0_40px_rgba(59,130,246,0.3)] invert dark:invert-0 transition-all"
              />
            </div>

          </main>
        </div>
      </div>

      {/* --- LOWER PAGE CONTENT --- */}
      <div className="relative w-full overflow-hidden z-10 pointer-events-none">

        {/* Foreground Content */}
        <div className="relative z-10 pointer-events-none [&>*]:pointer-events-auto">
          {/* --- EVENT DESCRIPTION SECTION --- */}
          <section id="about" className="py-24 relative overflow-hidden">

            <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
              <h2
                className="text-xl md:text-3xl font-bold dark:font-normal tracking-wide text-black dark:text-white leading-tight mb-10 transition-colors"
                style={{ textShadow: mounted && resolvedTheme !== 'dark' ? "none" : "0 0 3px rgba(255, 255, 255, 1), 0 0 6px rgba(40, 85, 124, 0.8), 0 0 9px rgba(67, 83, 207, 0.6)" }}
              >
                {mounted && !isMobile ? (
                  <TextReveal
                    text={tx.aboutHeading}
                    delay={0.5}
                    className="inline-block text-4xl md:text-5xl lg:text-6xl font-black dark:font-bold"
                  />
                ) : (
                  <span className="inline-block text-4xl md:text-5xl lg:text-6xl font-black dark:font-bold">{tx.aboutHeading}</span>
                )}
              </h2>
              <div className="space-y-6 text-black dark:text-gray-400 font-medium dark:font-light text-base md:text-lg leading-relaxed text-justify md:text-center transition-colors">
                <p>{tx.aboutP1}</p>
                <p>{tx.aboutP2}</p>
              </div>
            </div>
          </section>

          {/* --- MASCOT SECTION --- */}
          <section id="mascot" className="py-24 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-100 dark:bg-blue-900/10 blur-[140px] rounded-full pointer-events-none transition-colors" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-200/30 dark:bg-blue-500/5 blur-[80px] rounded-full pointer-events-none transition-colors" />

            <style dangerouslySetInnerHTML={{
              __html: `
              @keyframes mascotFloat {
                0%, 100% { transform: translateY(0px) rotate(-1deg); }
                50% { transform: translateY(-18px) rotate(1deg); }
              }
              @keyframes mascotGlow {
                0%, 100% { filter: drop-shadow(0 0 20px rgba(59,130,246,0.3)) drop-shadow(0 20px 40px rgba(0,0,0,0.2)); }
                50% { filter: drop-shadow(0 0 40px rgba(59,130,246,0.6)) drop-shadow(0 30px 50px rgba(0,0,0,0.3)); }
              }
              .mascot-img {
                animation: mascotFloat 5s ease-in-out infinite, mascotGlow 5s ease-in-out infinite;
              }
              @keyframes starTwinkle {
                0%, 100% { opacity: 0.3; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
              }
              .star-1 { animation: starTwinkle 2.1s ease-in-out infinite; }
              .star-2 { animation: starTwinkle 1.7s ease-in-out infinite 0.4s; }
              .star-3 { animation: starTwinkle 2.5s ease-in-out infinite 0.9s; }
              .star-4 { animation: starTwinkle 1.9s ease-in-out infinite 1.3s; }
            `}} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

              {/* Section Header */}
              <div className="text-center mb-16">
                <p className="text-sm font-bold tracking-[0.3em] uppercase mb-3 transition-colors">
                  {tx.mascotLabel}
                </p>
                <h2
                  className="text-2xl font-bold dark:font-light tracking-widest text-black dark:text-gray-300 uppercase transition-colors"
                  style={{ textShadow: mounted && resolvedTheme !== 'dark' ? "none" : "0 0 3px rgba(255,255,255,0.5), 0 0 8px rgba(59,130,246,0.4)" }}
                >
                  Mr. Sprint
                </h2>
              </div>

              {/* Main mascot layout */}
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                {/* Left: Description cards (stacked) */}
                <div className="flex flex-col gap-6 lg:w-[45%] order-2 lg:order-1">

                  {/* Card 1 - Main bio */}
                  <div className="relative bg-white/70 dark:bg-white/[0.03] backdrop-blur-md dark:border-white/[0.06] rounded-3xl p-7 shadow-[0_4px_24px_rgba(59,130,246,0.08)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.4)] hover:border-blue-400/40 dark:hover:border-blue-500/20 transition-all duration-500 group overflow-hidden">
                    {/* Corner glow */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none transition-colors" />
                    {/* Twinkling stars */}
                    <span className="star-1 absolute top-4 left-4 text-blue-400 dark:text-blue-300 text-lg select-none pointer-events-none">✦</span>
                    <span className="star-2 absolute top-6 right-10 text-blue-500 dark:text-cyan-400 text-sm select-none pointer-events-none">✦</span>

                    <p className="text-black/80 dark:text-gray-300 font-medium dark:font-light text-sm md:text-base leading-relaxed text-justify relative z-10 transition-colors">
                      {tx.mascotBio}
                    </p>
                  </div>

                  {/* Card 2 - Motivational quote */}
                  <div className="relative bg-white/70 dark:bg-white/[0.03] backdrop-blur-md dark:border-white/[0.06] rounded-3xl p-7 shadow-[0_4px_24px_rgba(59,130,246,0.08)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.4)] hover:border-blue-400/40 dark:hover:border-blue-500/20 transition-all duration-500 group overflow-hidden">
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-2xl pointer-events-none transition-colors" />
                    <span className="star-3 absolute bottom-5 right-6 text-blue-400 dark:text-cyan-300 text-lg select-none pointer-events-none">✦</span>
                    <span className="star-4 absolute top-5 right-4 text-blue-500 dark:text-blue-300 text-sm select-none pointer-events-none">✦</span>

                    <p className="text-black/80 dark:text-gray-300 font-medium dark:font-light text-sm md:text-base leading-relaxed relative z-10 transition-colors">
                      {tx.mascotQuote}
                    </p>
                  </div>

                  {/* Meet Mr. Sprint tagline */}
                  <div className="text-center lg:text-left">
                    <p className="text-gray-600 dark:text-gray-500 font-medium dark:font-light text-sm italic transition-colors">
                      {tx.mascotTagline}
                    </p>
                  </div>
                </div>

                {/* Right: Mascot image */}
                <div className="lg:w-[55%] flex justify-center items-end order-1 lg:order-2 relative">
                  {/* Radial glow behind mascot */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-blue-400/10 dark:bg-blue-500/15 blur-[60px] transition-colors" />
                  </div>

                  {/* Decorative floating badge */}
                  <div className="hidden md:block absolute top-4 right-4 md:top-8 md:right-8 bg-white/80 dark:bg-white/[0.05] backdrop-blur-md dark:border-blue-500/20 rounded-2xl px-4 py-2 shadow-sm dark:shadow-none z-10 transition-colors">
                    <p className="text-[10px] md:text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">Meet</p>
                    <p className="text-sm md:text-base font-black text-black dark:text-white tracking-wider">MR. SPRINT</p>
                  </div>

                  <img
                    src="/mascot/Pengenalan maskot (Kanan).webp"
                    alt="Mr. Sprint — Official Mascot of Tech Sprint 2026"
                    className="mascot-img w-64 md:w-80 lg:w-[420px] xl:w-[480px] h-auto object-contain relative z-10 select-none"
                    draggable={false}
                  />
                </div>

              </div>
            </div>
          </section>

          {/* Tracks Info Section */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold dark:font-light text-center mb-16 tracking-widest text-black dark:text-gray-300 uppercase transition-colors">
                <TextReveal text={tx.tracksHeading} />
              </h2>

              <MagicBento
                cards={trackCards}
                textAutoHide={true}
                enableStars={mounted ? !isMobile : true}
                enableSpotlight={mounted ? !isMobile : true}
                enableBorderGlow={mounted ? !isMobile : true}
                enableTilt={false}
                enableMagnetism={false}
                clickEffect={mounted ? !isMobile : true}
                spotlightRadius={400}
                particleCount={mounted && isMobile ? 0 : 12}
                glowColor="59, 130, 246"
                disableAnimations={mounted ? isMobile : false}
              />

            </div>
          </section>

          {/* --- TIMELINE SECTION --- */}
          <section className="py-24 relative overflow-hidden">
            {/* Glow background effect */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none transition-colors"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-2xl font-bold dark:font-light tracking-widest text-black dark:text-gray-300 uppercase flex items-center justify-center gap-3 transition-colors">
                  {tx.timelineHeading}
                </h2>
                <p className="text-gray-800 dark:text-gray-500 font-medium dark:font-light mt-4 transition-colors">{tx.timelineSubheading}</p>
              </div>

              <MagicTimeline events={serializedTimelineEvents} glowColor="59, 130, 246" />
            </div>
          </section>

          {/* --- FAQ SECTION --- */}
          <FAQ />

          {/* --- SPONSORS & PARTNERS SECTION --- */}
          <section className="py-24 relative overflow-hidden">
            {/* subtle background glow */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-100 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none z-0 transition-colors"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="mb-16 flex flex-col items-center text-center gap-6">
                <h2 className="text-2xl md:text-3xl font-bold dark:font-light tracking-widest text-black dark:text-gray-300 uppercase flex items-center justify-center gap-3 transition-colors">
                  <TextReveal text={tx.sponsorsHeading} />
                </h2>
                <Link href="/sponsorship" className="px-6 py-2.5 rounded-full bg-black/[0.02] dark:bg-white/[0.02] text-sm font-bold dark:font-light text-black dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-white transition-all duration-300 shadow-none dark:shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  {tx.becomeSponsort}
                </Link>
              </div>

              <div className="flex flex-col gap-6">
                {/* Grid Style for Tiered Sponsors */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                  {/* Dicoding */}
                  <a href="https://www.dicoding.com/" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-white/[0.02] p-8 rounded-3xl h-40 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all duration-300 group hover:border-gray-300 dark:hover:border-white/20 shadow-sm dark:shadow-none">
                    <img
                      src="/sponsor-logo/Dicoding-Logo-White.png"
                      alt="Dicoding"
                      className="max-h-full w-auto object-contain transition-all duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100 invert dark:invert-0"
                    />
                  </a>

                  {/* Dyputu */}
                  <a href="https://dyputustudio.com/" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-white/[0.02] p-8 rounded-3xl h-40 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all duration-300 group hover:border-gray-300 dark:hover:border-white/20 shadow-sm dark:shadow-none">
                    <img
                      src="/sponsor-logo/Dyputu.png"
                      alt="Dyputu"
                      className="max-h-full w-auto object-contain transition-all duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                  </a>

                  {/* KitaLulus */}
                  <a href="https://www.kitalulus.com/" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-white/[0.02] p-8 rounded-3xl h-40 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all duration-300 group hover:border-gray-300 dark:hover:border-white/20 shadow-sm dark:shadow-none">
                    <img
                      src="/sponsor-logo/KitaLulus-Logo-White.png"
                      alt="KitaLulus"
                      className="max-h-full w-auto object-contain transition-all duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100 invert dark:invert-0"
                    />
                  </a>

                  {/* Sewa HT */}
                  <a href="https://sewaht.id/" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-white/[0.02] p-8 rounded-3xl h-40 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all duration-300 group hover:border-gray-300 dark:hover:border-white/20 shadow-sm dark:shadow-none">
                    <img
                      src="/sponsor-logo/logo-sewa-HT.png"
                      alt="Sewa HT"
                      className="max-h-full w-auto object-contain transition-all duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                  </a>
                </div>
              </div>

            </div>
          </section>

          {/* --- FOOTER --- */}
          <Footer />

        </div>
      </div>

    </div>
  );
}

// Output: Displays a modern, dark-themed landing page with smooth gradients, elegant thin typography, and glowing pill buttons with Lucide icons.