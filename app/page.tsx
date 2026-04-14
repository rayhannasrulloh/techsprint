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
import {
  ArrowUpRight, ArrowRight, MonitorSmartphone, DatabaseZap, Cpu, Calendar,
  UserPlus, Timer, MonitorPlay, Rocket,
  Mail, MapPin, MessageSquare, Instagram, Twitter, Linkedin
} from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { resolvedTheme } = useTheme();

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

  // Data Track
  const trackCards = [
    {
      href: '/track/ui-ux',
      title: 'UI/UX Design',
      description: 'Design intuitive interfaces. Craft compelling user experiences and stunning prototypes.',
      icon: <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><MonitorSmartphone className="text-blue-500 w-7 h-7 stroke-[1.5]" /></div>,
      className: "group",
      color: 'rgba(255,255,255,0.02)',
      cta: <span className="inline-flex items-center text-sm font-bold dark:font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform duration-300">Learn More <ArrowRight className="ml-2 w-4 h-4" /></span>
    },
    {
      href: '/track/data-automation',
      title: 'Data Automation',
      description: 'Streamline workflows. Build intelligent scripts and automate data processing pipelines.',
      icon: <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><DatabaseZap className="text-blue-500 w-7 h-7 stroke-[1.5]" /></div>,
      className: "group",
      color: 'rgba(255,255,255,0.02)',
      cta: <span className="inline-flex items-center text-sm font-bold dark:font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform duration-300">Learn More <ArrowRight className="ml-2 w-4 h-4" /></span>
    },
    {
      href: '/track/system-analyst',
      title: 'System Analysis',
      description: 'Architect robust systems. Create BRD, SRS, and comprehensive system architecture diagrams.',
      icon: <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Cpu className="text-blue-500 w-7 h-7 stroke-[1.5]" /></div>,
      className: "group",
      color: 'rgba(255,255,255,0.02)',
      cta: <span className="inline-flex items-center text-sm font-bold dark:font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform duration-300">Learn More <ArrowRight className="ml-2 w-4 h-4" /></span>
    }
  ];

  // Data Timeline Event
  const timelineEvents = [
    {
      date: "6 - 12 April 2026",
      title: "Early Bird",
      desc: "Open registration for early birds. Gather your team of 3 and secure your spot early.",
      icon: UserPlus,
      color: "text-blue-400", bg: "bg-blue-900/10", border: "border-blue-900/10"
    },
    {
      date: "13 - 26 April 2026",
      title: "Normal Batch Registration",
      desc: "Last chance to join!",
      icon: Timer,
      color: "text-blue-400", bg: "bg-blue-900/10", border: "border-blue-900/10"
    },
    {
      date: "6 May 2026",
      title: "Technical Meeting",
      desc: "Mandatory briefing for all participants. We will discuss rules, submission guidelines, and judging criteria.",
      icon: MonitorPlay,
      color: "text-blue-400", bg: "bg-blue-900/10", border: "border-blue-900/10"
    },
    {
      date: "9 - 10 May 2026",
      title: "Competition Day",
      desc: "The sprint begins! Starts at 12:00 PM and ends the next day at 12:00 PM. Build your solutions and conquer the checkpoints.",
      icon: Rocket,
      color: "text-blue-400", bg: "bg-blue-900/10", border: "border-blue-900/10"
    }
  ];

  const serializedTimelineEvents = timelineEvents.map((item) => {
    const Icon = item.icon;
    return {
      date: item.date,
      title: item.title,
      desc: item.desc,
      color: item.color,
      nodeMarker: (
        <div className={`w-6 h-6 md:w-8 md:h-8 ${item.bg} ${item.border} border rounded-full flex items-center justify-center`}>
          <Icon className={`w-3 h-3 md:w-4 md:h-4 ${item.color}`} />
        </div>
      )
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
              <Link href="/track/ui-ux" className="text-sm font-medium text-black hover:text-blue-600 dark:font-light dark:text-gray-300 dark:hover:text-white transition-colors tracking-wide">UI/UX Design</Link>
              <Link href="/track/data-automation" className="text-sm font-medium text-black hover:text-blue-600 dark:font-light dark:text-gray-300 dark:hover:text-white transition-colors tracking-wide">Data Automation</Link>
              <Link href="/track/system-analyst" className="text-sm font-medium text-black hover:text-blue-600 dark:font-light dark:text-gray-300 dark:hover:text-white transition-colors tracking-wide">System Analyst</Link>
            </div>

            <div className="flex-1 flex justify-end space-x-2 md:space-x-6 items-center">

              {/* Authentication Info / App Entry */}
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <a href="https://www.instagram.com/techsprint26/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-black hover:text-blue-600 dark:font-light dark:text-gray-300 dark:hover:text-white transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <Link href="/dashboard" aria-describedby="Masuk ke Dashboard anda" className="flex items-center text-sm bg-blue-600 text-white px-5 py-2 rounded-full font-medium shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:scale-105 transition-all duration-300">
                    Dashboard
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-medium text-black hover:text-blue-600 dark:font-light dark:text-gray-300 dark:hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="flex items-center text-sm bg-blue-600 text-white px-5 py-2 rounded-full font-medium dark:hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] dark:hover:scale-105 transition-all duration-300">
                    Register <ArrowUpRight className="ml-1 w-4 h-4" />
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
                    text={[
                      "Early Bird Registration is Closed!",
                      "Normal Batch Registration is Open!"
                    ]}
                    delay={1.8}
                    speed={0.05}
                    pauseBetween={2500}
                    className="inline-block mb-6 text-xl md:text-2xl h-8 text-center md:text-left"
                  />
                ) : (
                  <span className="inline-block mb-6 text-xl md:text-2xl text-center md:text-left h-8">Normal Registration is Open!</span>
                )}
                <Countdown targetDate="2026-04-26T23:59:59" />
              </div>

              <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-6 mt-4">
                {/* Reference Button Style: Large */}
                <Link
                  href="/register" 
                  className="flex items-center text-white text-lg bg-gradient-to-r from-[#0033ff] to-[#001188] px-8 py-3 rounded-full font-normal dark:shadow-[0_0_20px_rgba(0,51,255,0.4)] dark:hover:shadow-[0_0_35px_rgba(0,51,255,0.7)] transition-all duration-300">
                  Register Now! <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-black hover:text-blue-600 font-medium dark:text-gray-400 dark:hover:text-white dark:font-light tracking-wide transition-colors"
                >
                  Learn More
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
                    text="Ready to Innovate, Create the Future State"
                    delay={0.5}
                    className="inline-block text-4xl md:text-5xl lg:text-6xl font-black dark:font-bold"
                  />
                ) : (
                  <span className="inline-block text-4xl md:text-5xl lg:text-6xl font-black dark:font-bold">Ready to Innovate,<br />Create the Future State</span>
                )}
              </h2>
              <div className="space-y-6 text-black dark:text-gray-400 font-medium dark:font-light text-base md:text-lg leading-relaxed text-justify md:text-center transition-colors">
                <p>
                  Tech Sprint 2026 - <span className="text-blue-600 dark:text-gray-200 font-bold dark:font-normal">3IN1</span> is the flagship innovation competition organized by the Research and Development (R&D) Division of the President University Major Association of Information Systems (PUMA IS). Building on the prestigious legacy of previous iterations, evolving from CompClub (2021-2023) to the international Golden Code Hackathon in 2025, this year’s event is designed as an intensive 2-day innovation sprint. With a core philosophy of <span className="text-black dark:text-white font-bold dark:font-medium">"Tech With Impact,"</span> rooted in the philosophy of <span className="text-black dark:text-white font-bold dark:font-medium">THINK, BUILD,</span> and <span className="text-black dark:text-white font-bold dark:font-medium">IMPACT</span>, the sprint challenges participants to move from analytical thinking (THINK) to hands-on prototyping (BUILD) to deliver measurable real-world implementation (IMPACT).
                </p>
                <p>
                  Carrying the mission to create sustainable tech solutions addressing real campus and student challenges, the event introduces a unique approach across three specialized tracks: <span className="text-blue-600 dark:text-gray-200 font-bold dark:font-normal">UI/UX Design, Data Automation, and System Analysis</span>. Each track targets 8 competing teams, bringing together a total of 72 participants across all three tracks. The sprint unfolds in two structured phases: <span className="text-black dark:text-white font-bold dark:font-medium">Day 1 (BUILD)</span>, where teams ideate and rapidly prototype their solutions, and <span className="text-black dark:text-white font-bold dark:font-medium">Day 2 (TEST + PITCH)</span>, where top teams present their final outputs to a panel of industry judges.
                </p>
              </div>
            </div>
          </section>

          {/* Tracks Info Section */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold dark:font-light text-center mb-16 tracking-widest text-black dark:text-gray-300 uppercase transition-colors">
                <TextReveal text="Track Categories" />
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
                  Event Journey
                </h2>
                <p className="text-gray-800 dark:text-gray-500 font-medium dark:font-light mt-4 transition-colors">Mark your calendar for these important dates.</p>
              </div>

              <MagicTimeline events={serializedTimelineEvents} glowColor="59, 130, 246" />
            </div>
          </section>

          {/* --- TOTAL PRIZEPOOL SECTION --- */}
          {/* <section className="py-32 relative overflow-hidden flex flex-col items-center justify-center"> */}
          {/* Glow effect specific to Prizepool */}
          {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[250px] bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10 text-center px-6">
              <p className="text-sm font-medium tracking-[0.2em] text-yellow-500 uppercase mb-4">
                Total Prizepool
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-6xl md:text-8xl lg:text-9xl font-light text-white drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                <span className="text-4xl md:text-6xl text-yellow-500">Rp</span>
                <NumberTicker value={20000000} delay={0.5} />
                <span className="text-4xl md:text-6xl text-yellow-500">+</span>
              </div>
              <p className="text-gray-400 mt-8 font-light max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                Compete, innovate, and win your share of the massive prize pool along with exclusive opportunities from our industry partners.
              </p>
            </div>
          </section> */}

          {/* --- FAQ SECTION --- */}
          <FAQ />

          {/* --- SPONSORS & PARTNERS SECTION --- */}
          <section className="py-24 relative overflow-hidden">
            {/* subtle background glow */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-100 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none z-0 transition-colors"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="mb-16 flex flex-col items-center text-center gap-6">
                <h2 className="text-2xl md:text-3xl font-bold dark:font-light tracking-widest text-black dark:text-gray-300 uppercase flex items-center justify-center gap-3 transition-colors">
                  <TextReveal text="Sponsored by" />
                </h2>
                <Link href="/sponsorship" className="px-6 py-2.5 rounded-full bg-black/[0.02] dark:bg-white/[0.02] text-sm font-bold dark:font-light text-black dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-white transition-all duration-300 shadow-none dark:shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  Become a sponsor
                </Link>
              </div>

              <div className="flex flex-col gap-6">
                {/* Case Collaborator / Main Sponsor (Full Width) */}
                <div className="bg-white dark:bg-white/[0.02] rounded-3xl p-8 md:p-12 flex flex-col xl:flex-row items-center justify-between gap-8 md:gap-12 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden shadow-sm dark:shadow-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-100 to-blue-500/0 dark:via-blue-500/5 opacity-0 group-hover:opacity-100 transition-duration-700"></div>

                  <div className="flex flex-col items-center xl:items-start text-center xl:text-left z-10 w-full xl:w-1/3">
                    <span className="text-xs font-bold dark:font-medium tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4 transition-colors">Case Collaborator</span>
                    <span className="text-4xl md:text-5xl lg:text-6xl font-black dark:font-bold tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-500 mb-2">Coming Soon</span>
                    <span className="text-sm text-gray-800 dark:text-gray-400 font-medium dark:font-light transition-colors">The grand reveal of our main case collaborator will unlock on May 1st, 2026.</span>
                  </div>

                  <div className="z-10 flex items-center justify-center bg-gray-100 dark:bg-[#03050a]/50 p-6 md:p-8 py-8 md:py-10 rounded-3xl shadow-inner w-full xl:w-auto overflow-x-auto transition-colors">
                    <Countdown targetDate="2026-05-01T00:00:00" />
                  </div>
                </div>

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