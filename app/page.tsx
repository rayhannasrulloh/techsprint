import Link from "next/link";
import { TextReveal } from "../components/TextReveal";
import SoftAurora from "../components/SoftAurora";
import MagicBento from "../components/MagicBento";
import MagicTimeline from "../components/MagicTimeline";
import { 
  ArrowUpRight, MonitorSmartphone, DatabaseZap, Cpu, Calendar, 
  UserPlus, Timer, MonitorPlay, Rocket, 
  Search, Train, Cloud, Utensils, // Sponsor Icons
  Mail, MapPin, MessageSquare, Instagram, Twitter, Linkedin // Footer Icons
} from "lucide-react";

export default function LandingPage() {
  const trackCards = [
    {
      title: 'UI/UX Design',
      description: 'Design intuitive interfaces. Focus on user journey, wireframing, and interactive prototypes.',
      icon: <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><MonitorSmartphone className="text-white w-7 h-7 stroke-[1.5]" /></div>,
      className: "group",
      color: 'rgba(255,255,255,0.02)'
    },
    {
      title: 'Data Automation',
      description: 'Build scripts to process and automate pipelines. Show skills in Python, Node, and data efficiency.',
      icon: <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><DatabaseZap className="text-white w-7 h-7 stroke-[1.5]" /></div>,
      className: "group",
      color: 'rgba(255,255,255,0.02)'
    },
    {
      title: 'System Analyst',
      description: 'Architect robust systems. Create BRD, SRS, and comprehensive system architecture diagrams.',
      icon: <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Cpu className="text-white w-7 h-7 stroke-[1.5]" /></div>,
      className: "group",
      color: 'rgba(255,255,255,0.02)'
    }
  ];

  // Data Timeline Event
  const timelineEvents = [
    { 
      date: "6 - 21 April 2026", 
      title: "Batch 1 Registration", 
      desc: "Open registration for early birds. Gather your team of 3 and secure your spot early.", 
      icon: UserPlus,
      color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30"
    },
    { 
      date: "22 April - 1 May 2026", 
      title: "Batch 2 Registration", 
      desc: "Last chance to join! Registration officially closes on May 1st at 23:59 WIB.", 
      icon: Timer,
      color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30"
    },
    { 
      date: "6 May 2026", 
      title: "Technical Meeting", 
      desc: "Mandatory briefing for all participants. We will discuss rules, submission guidelines, and judging criteria.", 
      icon: MonitorPlay,
      color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30"
    },
    { 
      date: "9 - 10 May 2026", 
      title: "Hackathon Day (24-Hour Sprint)", 
      desc: "The sprint begins! Starts at 12:00 PM and ends the next day at 12:00 PM. Build your solutions and conquer the checkpoints.", 
      icon: Rocket,
      color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30"
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f24] via-[#050814] to-black text-white font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* Hero Wrapper with SoftAurora Background */}
      <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
        
        {/* Soft Aurora Background Layer */}
        <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen pointer-events-auto">
          <SoftAurora
            speed={0.6}
            scale={1.5}
            brightness={1}
            color1="#0a2a5e" // Tech Sprint Dark Tone
            color2="#00bbff" // Cyan glow matching theme
            noiseFrequency={2.5}
            noiseAmplitude={1}
            bandHeight={0.5}
            bandSpread={1}
            octaveDecay={0.1}
            layerOffset={0}
            colorSpeed={1}
            enableMouseInteraction={true}
            mouseInfluence={0.25}
          />
        </div>

        {/* Foreground Layer (Nav + Hero) */}
        <div className="relative z-10 flex-1 flex flex-col pointer-events-none">
          {/* Navigation */}
          <nav className="border-white/5 p-6 flex justify-between items-center max-w-7xl mx-auto w-full pointer-events-auto">
            
            <div className="flex items-center">
              <img src="/logo-techsprint-2026.png" alt="3IN1 Tech Sprint 2026" className="h-24 md:h-24 w-auto object-contain mix-blend-screen" />
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
          <main className="max-w-5xl mx-auto px-6 pt-8 pb-20 text-center flex flex-col items-center flex-1 justify-center pointer-events-auto">
            
            {/* <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-blue-200 tracking-wide">
              <span className="text-blue-500"></></span> New! Winners announced at closing ceremony <ArrowUpRight className="w-3 h-3" />
            </div> */}

            {/* <img src="/logo-3in1-tech-sprint.png" alt="3IN1 Tech Sprint" className="mix-blend-screen w-1/4 h-auto" /> */}

            
            {/* Giant Timer Simulation (Like Reference Image) */}
            {/* <div className="mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
              <TextReveal 
                text="3IN1 Tech Sprint" 
                className="text-7xl md:text-9xl font-light tracking-tighter text-blue-400"
              />
            </div> */}
            
            <h1 
              className="text-xl md:text-3xl font-normal tracking-wide text-white mb-24 leading-tight"
              style={{ textShadow: "0 0 3px rgba(255, 255, 255, 1), 0 0 6px rgba(255,255,255,0.8), 0 0 9px rgba(67, 83, 207, 0.6)" }}
            >
              <TextReveal 
                text="24 Hours of Innovation. Join us for a weekend of creation, collaboration, and competition." 
                delay={0.5} 
                className="inline-block"
              />
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
        </div>
      </div>

      {/* Tracks Info Section */}
      <section className="border-t border-white/5 bg-gradient-to-b from-transparent to-black py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-light text-center mb-16 tracking-widest text-gray-300 uppercase">
            <TextReveal text="Track Categories" />
          </h2>
          
          <MagicBento 
            cards={trackCards}
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={true}
            spotlightRadius={400}
            particleCount={12}
            glowColor="59, 130, 246" 
            disableAnimations={false}
          />

        </div>
      </section>

      {/* --- NEW TIMELINE SECTION --- */}
      <section className="border-t border-white/5 bg-[#050814] py-24 relative overflow-hidden">
        {/* Glow background effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-light tracking-widest text-gray-300 uppercase flex items-center justify-center gap-3">
              Event Journey
            </h2>
            <p className="text-gray-500 font-light mt-4">Mark your calendar for these important dates.</p>
          </div>

          <MagicTimeline events={serializedTimelineEvents} glowColor="59, 130, 246" />
        </div>
      </section>

      {/* --- NEW: SPONSORS & PARTNERS SECTION --- */}
      <section className="border-t border-white/5 bg-[#03050a] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3">Official Partners</h2>
              <h3 className="text-3xl md:text-4xl font-light text-white">
                Supported by <span className="font-medium text-gray-300">industry leaders.</span>
              </h3>
            </div>
            <button className="px-5 py-2 rounded-full border border-white/10 text-sm font-light text-gray-300 hover:bg-white/5 transition-colors">
              Become a sponsor
            </button>
          </div>

          {/* Grid Style mimicking Supabase's layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Google */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl h-32 flex items-center justify-center hover:bg-white/[0.04] transition-colors group">
              <div className="flex items-center gap-3 text-gray-400 group-hover:text-white transition-colors">
                <img src="/g.webp" alt="Google" className="w-6 h-6" />
                <span className="text-xl font-medium tracking-tight">Google</span>
              </div>
            </div>

            {/* KAI */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl h-32 flex items-center justify-center hover:bg-white/[0.04] transition-colors group">
              <div className="flex items-center gap-3 text-gray-400 group-hover:text-[#f36f21] transition-colors">
                <Train className="w-8 h-8" />
                <span className="text-2xl font-bold tracking-tighter italic">KAI</span>
              </div>
            </div>

            {/* Google Cloud (Bigger Card Span) */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl h-32 flex items-center justify-center hover:bg-white/[0.04] transition-colors md:col-span-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-3 text-gray-400 group-hover:text-blue-400 transition-colors">
                <Cloud className="w-8 h-8" />
                <span className="text-2xl font-normal tracking-tight">Google Cloud</span>
              </div>
            </div>

            {/* HokBen */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl h-32 flex items-center justify-center hover:bg-white/[0.04] transition-colors group md:col-span-4 lg:col-span-2">
              <div className="flex items-center gap-3 text-gray-400 group-hover:text-yellow-500 transition-colors">
                <Utensils className="w-7 h-7" />
                <span className="text-2xl font-bold tracking-tight text-white group-hover:text-yellow-500 transition-colors">HokBen</span>
              </div>
            </div>

            {/* Placeholder 1 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl h-32 flex items-center justify-center hover:bg-white/[0.04] transition-colors text-gray-600 font-light text-sm">
              Your Logo Here
            </div>

            {/* Placeholder 2 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl h-32 flex items-center justify-center hover:bg-white/[0.04] transition-colors text-gray-600 font-light text-sm">
              Your Logo Here
            </div>

          </div>
        </div>
      </section>

      {/* --- NEW: FOOTER --- */}
      <footer className="border-t border-white/10 bg-[#020308] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="text-2xl font-light tracking-widest text-gray-200 mb-4">
                3IN1<span className="text-blue-500 font-medium">TECHSPRINT</span>
              </div>
              <p className="text-gray-400 font-light text-sm leading-relaxed mb-6">
                Empowering the next generation of tech leaders through intense innovation, collaboration, and 24-hour sprints.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-medium mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm font-light text-gray-400">
                <li><Link href="/register" className="hover:text-blue-400 transition-colors">Registration</Link></li>
                <li><Link href="/login" className="hover:text-blue-400 transition-colors">Team Dashboard</Link></li>
                <li><a href="#" className="flex items-center gap-2 hover:text-blue-400 transition-colors"><MessageSquare className="w-4 h-4"/> Feedback Form</a></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="text-white font-medium mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm font-light text-gray-400">
                <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-blue-500" /> academic@techsprint.web.id</li>
                <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" /> <span>President University<br/>Cikarang, Bekasi</span></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-white font-medium mb-6">Follow Us</h4>
              <p className="text-sm font-light text-gray-400 mb-4">Stay updated with our latest announcements.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-400 hover:border-blue-400 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-700 hover:border-blue-600 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 font-light text-xs">
              © {new Date().getFullYear()} 3IN1 Tech Sprint. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs font-light text-gray-500">
              <a href="#" className="hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Output: Displays a modern, dark-themed landing page with smooth gradients, elegant thin typography, and glowing pill buttons with Lucide icons.