import Link from "next/link";
import { ArrowLeft, CheckCircle2, Minus, Mail, Download } from "lucide-react";
import Footer from "../../components/Footer";

export default function SponsorshipPage() {
  const tiers = [
    {
      name: "Silver",
      price: "IDR 2M - 4M",
      color: "text-gray-400",
      bgBorder: "border-gray-400/30",
      bgGlow: "group-hover:shadow-[0_0_30px_rgba(156,163,175,0.2)]",
      features: [
        { label: "Logo Size", value: "Small" },
        { label: "Logo Location", value: "Poster, Banner" },
        { label: "Content", value: "1x" },
        { label: "IG Story Mention", value: "1x" },
        { label: "Spot at winner ceremony", value: "1 Person" },
        { label: "Adlibs", value: true },
        { label: "Documentation", value: true },
        { label: "E-Certificate & Special Thanks", value: true },
        { label: "Promotion on event", value: false },
        { label: "Speaker / Jury", value: false },
        { label: "Booth", value: false },
        { label: "Exposure Session", value: false },
      ]
    },
    {
      name: "Gold",
      price: "IDR 4M - 7M",
      color: "text-yellow-500",
      bgBorder: "border-yellow-500/50",
      bgGlow: "group-hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]",
      popular: true,
      features: [
        { label: "Logo Size", value: "Medium" },
        { label: "Logo Location", value: "Poster, Feeds, Banner" },
        { label: "Content", value: "2x" },
        { label: "IG Story Mention", value: "2x" },
        { label: "Spot at winner ceremony", value: "1-2 People" },
        { label: "Adlibs", value: true },
        { label: "Documentation", value: true },
        { label: "E-Certificate & Special Thanks", value: true },
        { label: "Promotion on event", value: true },
        { label: "Exposure Session", value: "15 Minutes" },
        { label: "Speaker / Jury", value: false },
        { label: "Booth", value: false },
      ]
    },
    {
      name: "Platinum",
      price: "IDR 7M - 10M",
      color: "text-blue-400",
      bgBorder: "border-blue-500/50",
      bgGlow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]",
      features: [
        { label: "Logo Size", value: "Large" },
        { label: "Logo Location", value: "Poster, Feeds, Banner, Certificate" },
        { label: "Content", value: "3x" },
        { label: "IG Story Mention", value: "3x" },
        { label: "Spot at winner ceremony", value: "2 People" },
        { label: "Adlibs", value: "Priority (Opening & Closing)" },
        { label: "Documentation", value: true },
        { label: "E-Certificate & Special Thanks", value: true },
        { label: "Promotion on event", value: true },
        { label: "Speaker / Jury", value: true },
        { label: "Booth", value: true },
        { label: "Exposure Session", value: "30 Minutes" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050814] text-white font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="border-b border-white/5 p-6 w-full absolute top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-light">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <img src="/logo-techsprint-2026.png" alt="3IN1 Tech Sprint 2026" className="h-10 w-auto object-contain mix-blend-screen" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            PARTNER WITH US!
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Join us in empowering the next generation of tech leaders. Showcase your brand, recruit top talent, and drive innovation at the largest 24-hour sprint event.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#contact" className="px-8 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Contact Us
            </a>
            <a href="/Proposal_Sponsorship_TechSprint.pdf" target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-full border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> Download Proposal
            </a>
          </div>
        </div>
      </section>

      {/* Why Sponsor Us / What you will get */}
      <section className="py-24 border-t border-white/5 bg-[#03050a]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-colors">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Unprecedented Reach</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">Connect with hundreds of passionate student developers, UI/UX designers, and product managers across top universities.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-colors">
            <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Top Talent Pipeline</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">Direct access to brilliant minds actively building solutions. The perfect environment for identifying and recruiting top-tier talent.</p>
          </div>

          <div className="flex flex-col items-center text-center p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-colors">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Brand Positioning</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">Elevate your brand organically among the developer community as an industry leader driving technological innovation forward.</p>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-4">Sponsorship Packages</h2>
            <p className="text-gray-400 font-light">Choose the perfect tier that aligns with your brand objectives.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {tiers.map((tier, idx) => (
              <div key={idx} className={`relative flex flex-col bg-white/[0.02] border ${tier.bgBorder} rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 group ${tier.bgGlow}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                    Most Popular
                  </div>
                )}
                
                <h3 className={`text-2xl font-normal uppercase tracking-widest mb-2 ${tier.color}`}>{tier.name}</h3>
                <div className="text-xl md:text-2xl font-light text-white mb-8 border-b border-white/10 pb-6">
                  {tier.price}
                </div>

                <div className="flex flex-col gap-4 flex-1">
                  {tier.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start justify-between gap-4 text-sm font-light">
                      <span className="text-gray-400 font-normal">{feature.label}</span>
                      <span className="text-white text-right max-w-[60%] flex justify-end">
                        {typeof feature.value === "boolean" ? (
                          feature.value ? (
                            <CheckCircle2 className={`w-5 h-5 ${tier.color}`} />
                          ) : (
                            <Minus className="w-5 h-5 text-gray-700" />
                          )
                        ) : (
                          <span className={`font-medium ${feature.value === "Small" || feature.value === "Medium" || feature.value === "Large" ? tier.color : ""}`}>
                            {feature.value}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <a href="#contact" className={`block w-full text-center py-3 rounded-xl border border-white/20 font-medium transition-colors ${tier.popular ? "bg-yellow-500 text-black border-transparent hover:bg-yellow-400" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                    Select {tier.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="py-24 border-t border-white/5 bg-[#03050a] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6">Let's build something incredible.</h2>
          <p className="text-gray-400 font-light text-lg mb-10">
            Have questions about our packages or want a tailored sponsorship plan? Send us an email and our partnership team will get back to you shortly.
          </p>
          <div className="inline-flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl md:rounded-full w-full md:w-auto">
            <div className="flex items-center gap-3 px-4 text-gray-300">
              <Mail className="w-5 h-5 text-blue-500" />
              <span className="font-light tracking-wide break-all text-left">academic@techsprint.web.id</span>
            </div>
            <a href="mailto:academic@techsprint.web.id?subject=Sponsorship%20Inquiry%20-%203IN1%20Tech%20Sprint" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl md:rounded-full font-medium transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
