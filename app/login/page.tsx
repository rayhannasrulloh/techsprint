"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setMessage("Login successful! Redirecting...");
      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f24] via-[#050814] to-black flex flex-col items-center justify-center p-6 text-white font-sans">
      <Link href="/" className="absolute top-8 left-8 text-xl font-light tracking-widest text-gray-200">
        3IN1<span className="text-blue-500 font-medium">TECHSPRINT</span>
      </Link>

      <div className="max-w-md w-full bg-white/[0.02] border border-white/10 rounded-3xl p-10 shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-light tracking-wide mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-400 font-light text-sm text-center mb-8">Enter your credentials to access the dashboard.</p>

        <form onSubmit={handleLogin} className="space-y-5">
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
              placeholder="Password"
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center mt-6 text-lg bg-gradient-to-r from-[#0033ff] to-[#001188] py-4 rounded-full font-normal shadow-[0_0_20px_rgba(0,51,255,0.3)] hover:shadow-[0_0_35px_rgba(0,51,255,0.6)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Access Dashboard"} 
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </button>
        </form>

        {message && <p className="mt-6 text-center text-sm font-light text-red-400">{message}</p>}

        <p className="mt-8 text-center text-sm text-gray-500 font-light">
          Don't have a team yet? <Link href="/register" className="text-blue-400 hover:text-blue-300">Register here</Link>
        </p>

        <p className="text-center text-sm text-gray-500 font-light">
          <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}
// Output: Displays a sleek Login form that authenticates via Supabase and redirects to the Dashboard.