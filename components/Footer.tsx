"use client";

import Link from "next/link";
import { MessageSquare, Mail, MapPin, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 pt-20 pb-10">
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
        </div>
      </div>
    </footer>
  );
}
