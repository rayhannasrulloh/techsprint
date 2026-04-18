"use client";

import Link from "next/link";
import { Mail, MapPin, Instagram } from "lucide-react";
import { useLang } from "./LanguageContext";

const t = {
  en: {
    tagline: "Ready to Innovate, Create the Future State",
    quickLinks: "Quick Links",
    registration: "Registration",
    teamDashboard: "Team Dashboard",
    contactUs: "Contact Us",
    followUs: "Follow Us",
    followDesc: "Stay updated with our latest announcements.",
    copyright: `© ${new Date().getFullYear()} 3IN1 Tech Sprint. All rights reserved.`,
    language: "Language",
  },
  id: {
    tagline: "Siap Berinovasi, Ciptakan Masa Depan",
    quickLinks: "Tautan Cepat",
    registration: "Pendaftaran",
    teamDashboard: "Dasbor Tim",
    contactUs: "Hubungi Kami",
    followUs: "Ikuti Kami",
    followDesc: "Dapatkan informasi terbaru dari kami.",
    copyright: `© ${new Date().getFullYear()} 3IN1 Tech Sprint. Seluruh hak cipta dilindungi.`,
    language: "Bahasa",
  },
};

export default function Footer() {
  const { lang, setLang } = useLang();
  const tx = t[lang];

  return (
    <footer className="border-t border-black/5 dark:border-white/5 pt-20 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-light tracking-widest text-black dark:text-gray-200 mb-4 transition-colors">
              <img src="/logo-techsprint-2026.webp" alt="Tech Sprint 2026 - 3IN1" className="w-40 md:w-30 lg:w-20 ml-auto mr-auto dark:mix-blend-screen invert dark:invert-0" />
            </div>
            <p className="text-black/70 dark:text-gray-400 font-medium dark:font-light text-sm leading-relaxed mb-6 transition-colors">
              {tx.tagline}
            </p>
            <div className="mt-6">
              <img src="/logo-pu.png" alt="3IN1 Tech Sprint 2026" className="w-40 ml-auto mr-auto dark:mix-blend-screen invert dark:invert-0" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-black dark:text-white font-medium mb-6 transition-colors">{tx.quickLinks}</h4>
            <ul className="space-y-4 text-sm font-medium dark:font-light text-black/70 dark:text-gray-400 transition-colors">
              <li><Link href="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{tx.registration}</Link></li>
              <li><Link href="/login" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">{tx.teamDashboard}</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-black dark:text-white font-medium mb-6 transition-colors">{tx.contactUs}</h4>
            <ul className="space-y-6 text-sm font-medium dark:font-light text-black/70 dark:text-gray-400 transition-colors">
              <a href="https://www.instagram.com/techsprint26">
                <li className="mb-3 flex items-center gap-3 hover:text-blue-600 dark:hover:text-white transition-colors"><Instagram className="w-4 h-4 text-blue-600 dark:text-blue-500" /> @techsprint26</li>
              </a>
              <a href="mailto:academic@techsprint.web.id">
                <li className="mb-3 flex items-center gap-3 hover:text-blue-600 dark:hover:text-white transition-colors"><Mail className="w-4 h-4 text-blue-600 dark:text-blue-500" /> academic@techsprint.web.id</li>
              </a>
              <a href="https://maps.app.goo.gl/BgtqX3kiG3HM4x6C9">
                <li className="flex items-start gap-3 hover:text-blue-600 dark:hover:text-white transition-colors"><MapPin className="w-4 h-4 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" /> <span>President University<br />Cikarang, Bekasi</span></li>
              </a>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-black dark:text-white font-medium mb-6 transition-colors">{tx.followUs}</h4>
            <p className="text-sm font-medium dark:font-light text-black/70 dark:text-gray-400 mb-4 transition-colors">{tx.followDesc}</p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/techsprint26" className="w-10 h-10 rounded-full bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 flex items-center justify-center text-black/70 dark:text-gray-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 dark:hover:border-blue-500 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright + Language Toggle */}
        <div className="border-t border-black/5 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
          <p className="text-black/60 dark:text-gray-500 font-medium dark:font-light text-xs">
            {tx.copyright}
          </p>

          {/* Language Toggle Button */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-black/40 dark:text-gray-600 font-medium select-none">
              {tx.language}:
            </span>
            <div className="flex items-center rounded-full border border-black/10 dark:border-white/10 overflow-hidden bg-black/[0.03] dark:bg-white/[0.03]">
              <button
                onClick={() => setLang("id")}
                aria-label="Ganti bahasa ke Indonesia"
                className={`px-3 py-1 text-xs font-semibold tracking-wider transition-all duration-200 ${
                  lang === "id"
                    ? "bg-blue-600 text-white shadow-inner"
                    : "text-black/50 dark:text-gray-500 hover:text-blue-600 dark:hover:text-gray-300"
                }`}
              >
                ID
              </button>
              <span className="w-px h-3 bg-black/10 dark:bg-white/10" />
              <button
                onClick={() => setLang("en")}
                aria-label="Switch language to English"
                className={`px-3 py-1 text-xs font-semibold tracking-wider transition-all duration-200 ${
                  lang === "en"
                    ? "bg-blue-600 text-white shadow-inner"
                    : "text-black/50 dark:text-gray-500 hover:text-blue-600 dark:hover:text-gray-300"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
