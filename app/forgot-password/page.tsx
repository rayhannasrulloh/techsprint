"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      // Send password reset email via Supabase
      // It will redirect the user to the update-password page after clicking the link in the email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setIsSuccess(true);
      setMessage("✅ Reset link sent! Please check your email inbox or spam folder.");
      setEmail(""); // Clear input

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
        <h2 className="text-3xl font-light tracking-wide mb-2 text-center">Reset Password</h2>
        <p className="text-gray-400 font-light text-sm text-center mb-8">
          Enter your registered email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Registered Email"
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center mt-6 text-lg bg-gradient-to-r from-[#0033ff] to-[#001188] py-4 rounded-full font-normal shadow-[0_0_20px_rgba(0,51,255,0.3)] hover:shadow-[0_0_35px_rgba(0,51,255,0.6)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Sending Link..." : "Send Reset Link"} 
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </button>
        </form>

        {message && (
          <p className={`mt-6 text-center text-sm font-light ${isSuccess ? 'text-blue-300' : 'text-red-400'}`}>
            {message}
          </p>
        )}

        <p className="mt-8 text-center text-sm text-gray-500 font-light">
          Remember your password? <Link href="/login" className="text-blue-400 hover:text-blue-300">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
// Output: Renders the Forgot Password UI with Supabase email reset functionality.