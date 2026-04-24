"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setIsLoading(true);
    const toastId = toast.loading("Creating admin account request...");

    try {
      // 1. Sign Up to Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Insert into admin_profiles table
        const { error: profileError } = await supabase
          .from("admin_profiles")
          .insert([
            {
              id: authData.user.id,
              full_name: fullName,
              email: email,
              status: "pending", // Default status
            },
          ]);

        if (profileError) throw profileError;

        toast.success("Request sent! Please wait for Developer approval.", { id: toastId });
        router.push("/admin-secret-panel");
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-sm bg-[#1c1c1c] border border-white/10 rounded-xl p-8 shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        <div className="relative z-10 text-center mb-8">
          <h2 className="text-xl text-white tracking-wide">Admin Registration</h2>
          <p className="text-gray-400 text-xs mt-2">Request Clearance Access</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-[#121212] border border-white/10 rounded-md p-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Official Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-[#121212] border border-white/10 rounded-md p-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Create Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#121212] border border-white/10 rounded-md p-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#121212] border border-white/10 rounded-md p-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-all shadow-sm disabled:opacity-50 mt-4"
          >
            {isLoading ? "Requesting..." : "Request Access"} {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6 relative z-10">
          Already have an account?{" "}
          <Link href="/admin-secret-panel" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
