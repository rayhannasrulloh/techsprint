"use client";

import Link from "next/link";
import { MessageSquare, Mail, MapPin, Instagram, Twitter, Linkedin } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 pt-20 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-light tracking-widest text-black dark:text-gray-200 mb-4 transition-colors">
              <img src="/logo-techsprint-2026.webp" alt="Tech Sprint 2026 - 3IN1" className="w-40 md:w-30 lg:w-20 ml-auto mr-auto dark:mix-blend-screen invert dark:invert-0" />
            </div>
            <p className="text-black/70 dark:text-gray-400 font-medium dark:font-light text-sm leading-relaxed mb-6 transition-colors">
              Ready to Innovate, Create the Future State
            </p>
            <div className="mt-6">
              <img src="/logo-pu.png" alt="3IN1 Tech Sprint 2026" className="w-40 ml-auto mr-auto dark:mix-blend-screen invert dark:invert-0" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-black dark:text-white font-medium mb-6 transition-colors">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium dark:font-light text-black/70 dark:text-gray-400 transition-colors">
              <li><Link href="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Registration</Link></li>
              <li><Link href="/login" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Team Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-black dark:text-white font-medium mb-6 transition-colors">Contact Us</h4>
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
            <h4 className="text-black dark:text-white font-medium mb-6 transition-colors">Follow Us</h4>
            <p className="text-sm font-medium dark:font-light text-black/70 dark:text-gray-400 mb-4 transition-colors">Stay updated with our latest announcements.</p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/techsprint26" className="w-10 h-10 rounded-full bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 flex items-center justify-center text-black/70 dark:text-gray-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 dark:hover:border-blue-500 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
          <p className="text-black/60 dark:text-gray-500 font-medium dark:font-light text-xs">
            © {new Date().getFullYear()} 3IN1 Tech Sprint. All rights reserved.
          </p>
          {/* <div className="flex items-center gap-4">
            <ThemeToggle />
          </div> */}
        </div>
      </div>
    </footer>
  );
}
