"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsSuccess(false);

    // Validasi sederhana di sisi client
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("❌ Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      // Supabase automatically uses the session token from the URL to authorize this update
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setIsSuccess(true);
      setMessage("✅ Password successfully updated! Redirecting to login...");
      
      // Tendang balik ke halaman login setelah 2 detik
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error: any) {
      setIsSuccess(false);
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
        <h2 className="text-3xl font-light tracking-wide mb-2 text-center">New Password</h2>
        <p className="text-gray-400 font-light text-sm text-center mb-8">
          Please enter your new password below to regain access to your team dashboard.
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          {/* New Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Confirm New Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center mt-6 text-lg bg-gradient-to-r from-[#0033ff] to-[#001188] py-4 rounded-full font-normal shadow-[0_0_20px_rgba(0,51,255,0.3)] hover:shadow-[0_0_35px_rgba(0,51,255,0.6)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Update Password"} 
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </button>
        </form>

        {message && (
          <p className={`mt-6 text-center text-sm font-light ${isSuccess ? 'text-blue-300' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}