"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Users, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState("UI/UX");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // 1. Sign up the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Insert team data into the 'teams' table
      if (authData.user) {
        const { error: dbError } = await supabase
          .from("teams")
          .insert([
            {
              id: authData.user.id,
              team_name: teamName,
              track: track,
            },
          ]);

        if (dbError) throw dbError;
      }

      setMessage("✅ Registration successful! Please check your email or login.");
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f24] via-[#050814] to-black flex flex-col items-center justify-center p-6 text-white font-sans">
      <Link href="/" className="absolute top-8 left-8 text-xl font-light tracking-widest text-gray-200">
        3IN1<span className="text-blue-500 font-medium">TECH</span>
      </Link>

      <div className="max-w-md w-full bg-white/[0.02] border border-white/10 rounded-3xl p-10 shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-light tracking-wide mb-2 text-center">Join the Sprint</h2>
        <p className="text-gray-400 font-light text-sm text-center mb-8">Register your team to get started.</p>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Team Leader Email"
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (Min 6 chars)"
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Team Name */}
          <div className="relative">
            <Users className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name"
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Track Selection */}
          <div className="relative">
            <Zap className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
            >
              <option value="UI/UX">UI/UX Design</option>
              <option value="Data Automation">Data Automation</option>
              <option value="System Analyst">System Analyst</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center mt-6 text-lg bg-gradient-to-r from-[#0033ff] to-[#001188] py-4 rounded-full font-normal shadow-[0_0_20px_rgba(0,51,255,0.3)] hover:shadow-[0_0_35px_rgba(0,51,255,0.6)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Creating Team..." : "Register Team"} 
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </button>
        </form>

        {message && <p className="mt-6 text-center text-sm font-light text-blue-300">{message}</p>}

        <p className="mt-8 text-center text-sm text-gray-500 font-light">
          Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
// Output: Displays a futuristic Register form with glowing inputs and Supabase database integration.