// File: src/app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Users, Zap, User, UserPlus, Building, CreditCard, Link as LinkIcon, Upload, MessageSquare, Phone, AlertTriangle, CheckCircle2, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  
  // Data State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState("UI/UX");
  const [institution, setInstitution] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderNim, setLeaderNim] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [member2Name, setMember2Name] = useState("");
  const [member2Nim, setMember2Nim] = useState("");
  const [member3Name, setMember3Name] = useState("");
  const [member3Nim, setMember3Nim] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  
// UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- STATE MATA PASSWORD
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [message, setMessage] = useState("");

  // 1. Tahan submit form dan buka modal konfirmasi
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentFile) {
      toast.error("Please upload your payment proof.");
      return;
    }
    setShowConfirmModal(true);
  };

  // 2. Eksekusi pendaftaran sesungguhnya setelah dikonfirmasi
  const executeRegistration = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    const toastId = toast.loading("Preparing registration...");

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;

      if (authData.user) {
        toast.loading("Uploading payment proof...", { id: toastId });
        const fileExt = paymentFile!.name.split('.').pop();
        const fileName = `${authData.user.id}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('payment_proofs').upload(fileName, paymentFile!);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('payment_proofs').getPublicUrl(fileName);
        
        toast.loading("Saving team data securely...", { id: toastId });
        const { error: dbError } = await supabase.from("teams").insert([{
            id: authData.user.id,
            team_name: teamName,
            track: track,
            institution: institution,
            leader_email: email,
            leader_name: leaderName,
            leader_nim: leaderNim,
            leader_phone: leaderPhone,
            discord_username: discordUsername,
            member1_name: member2Name, 
            member2_nim: member2Nim,
            member2_name: member3Name, 
            member3_nim: member3Nim,
            cv_link: cvLink,
            payment_proof_url: publicUrlData.publicUrl,
            status: 'pending'
        }]);

        if (dbError) throw dbError;
      }

      toast.success("Registration complete!", { id: toastId }); // <-- TOAST SUKSES
      setShowSuccessModal(true);
      setTimeout(() => router.push("/login"), 4000);

    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId, duration: 5000 }); // <-- TOAST ERROR
    } finally {
      setIsLoading(false);
    }
  
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f24] via-[#050814] to-black flex flex-col items-center justify-center p-6 text-white font-sans py-20 relative">
      
      {/* --- UX: SUCCESS OVERLAY MODAL --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] bg-[#050814] flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-4xl font-light text-white mb-2 tracking-wide">Registration Complete!</h2>
          <p className="text-gray-400 font-light max-w-md text-center">
            Welcome to 3IN1 Tech Sprint, <strong className="text-white">{teamName}</strong>. Your data has been securely saved.
          </p>
          <p className="text-sm text-blue-400 mt-8 animate-pulse">Redirecting to login page...</p>
        </div>
      )}

      {/* --- UX: CONFIRMATION MODAL --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0c122b] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl p-8 text-center relative">
            <button onClick={() => setShowConfirmModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Verify Your Data</h3>
            <p className="text-sm font-light text-gray-400 mb-6 leading-relaxed">
              Are you sure all team members' NIMs, Discord username, and payment receipt are correct? You cannot change this later.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm font-medium">Review Again</button>
              <button onClick={executeRegistration} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm font-medium shadow-[0_0_15px_rgba(37,99,235,0.4)]">Yes, Submit Data</button>
            </div>
          </div>
        </div>
      )}

      <Link href="/" className="absolute top-8 left-8 text-xl font-light tracking-widest text-gray-200">
        3IN1<span className="text-blue-500 font-medium">TECH</span>
      </Link>

      <div className="max-w-4xl w-full bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-light tracking-wide mb-2 text-center">Join the Sprint</h2>
        <p className="text-gray-400 font-light text-sm text-center mb-10">Register your team and complete the payment to secure your spot.</p>

        <form onSubmit={handlePreSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* COLUMN 1 */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-widest border-b border-white/10 pb-2">Team & Account</h3>
                <div className="relative"><Users className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-500 outline-none" /></div>
                <div className="relative"><Building className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Institution / High School" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-500 outline-none" /></div>
                <div className="relative"><Mail className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Leader Email (For Login)" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-500 outline-none" /></div>
                
                <div className="relative">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password (Min 6 chars)" 
                    className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm text-gray-200 focus:border-blue-500 outline-none" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative"><Zap className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                  <select value={track} onChange={(e) => setTrack(e.target.value)} className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-500 outline-none appearance-none">
                    <option value="UI/UX">UI/UX Design</option>
                    <option value="Data Automation">Data Automation</option>
                    <option value="System Analyst">System Analyst</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest border-b border-white/10 pb-2">Leader Identity</h3>
                <div className="relative"><User className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={leaderName} onChange={(e) => setLeaderName(e.target.value)} placeholder="Leader Full Name" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-emerald-500 outline-none" /></div>
                <div className="relative"><User className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={leaderNim} onChange={(e) => setLeaderNim(e.target.value)} placeholder="Leader NIM / NIK" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-emerald-500 outline-none" /></div>
                <div className="relative"><Phone className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="tel" required value={leaderPhone} onChange={(e) => setLeaderPhone(e.target.value)} placeholder="Leader WhatsApp" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-emerald-500 outline-none" /></div>
                <div className="relative"><MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={discordUsername} onChange={(e) => setDiscordUsername(e.target.value)} placeholder="Leader Discord Username" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-emerald-500 outline-none" /></div>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-widest border-b border-white/10 pb-2">Team Members</h3>
                <div className="flex gap-2">
                  <div className="relative w-full"><UserPlus className="absolute left-3 top-4 w-4 h-4 text-gray-500" /><input type="text" value={member2Name} onChange={(e) => setMember2Name(e.target.value)} placeholder="Member 2 Name" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-gray-200 focus:border-purple-500 outline-none" /></div>
                  <div className="relative w-full"><input type="text" value={member2Nim} onChange={(e) => setMember2Nim(e.target.value)} placeholder="Member 2 NIM" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-200 focus:border-purple-500 outline-none" /></div>
                </div>
                <div className="flex gap-2">
                  <div className="relative w-full"><UserPlus className="absolute left-3 top-4 w-4 h-4 text-gray-500" /><input type="text" value={member3Name} onChange={(e) => setMember3Name(e.target.value)} placeholder="Member 3 Name" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-gray-200 focus:border-purple-500 outline-none" /></div>
                  <div className="relative w-full"><input type="text" value={member3Nim} onChange={(e) => setMember3Nim(e.target.value)} placeholder="Member 3 NIM" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-200 focus:border-purple-500 outline-none" /></div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-widest border-b border-white/10 pb-2">Documents & Payment</h3>
                <div className="relative"><LinkIcon className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="url" value={cvLink} onChange={(e) => setCvLink(e.target.value)} placeholder="Drive Link to CVs (Optional)" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-yellow-500 outline-none" /></div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2 text-yellow-400">
                    <CreditCard className="w-5 h-5" /> <span className="font-semibold text-sm">Registration Fee</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Please transfer to: <br/><strong className="text-white text-base tracking-widest">BCA 00000</strong> a.n Tech Sprint</p>
                  
                  <label className="flex items-center justify-center gap-2 w-full bg-[#0a0f24] border border-dashed border-white/20 hover:border-yellow-500/50 rounded-lg p-3 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-300 truncate max-w-[200px]">{paymentFile ? paymentFile.name : "Upload Payment Receipt"}</span>
                    <input type="file" accept="image/*" required onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center mt-8 text-lg bg-gradient-to-r from-[#0033ff] to-[#001188] py-4 rounded-xl font-normal shadow-[0_0_20px_rgba(0,51,255,0.3)] hover:shadow-[0_0_35px_rgba(0,51,255,0.6)] transition-all duration-300 disabled:opacity-50">
            {isLoading ? message : "Register & Submit Payment"} 
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </button>
        </form>

        {message && message.includes('❌') && <p className="mt-6 text-center text-sm font-light text-red-400">{message}</p>}

        <p className="mt-8 text-center text-sm text-gray-500 font-light">
          Already registered? <Link href="/login" className="text-blue-400 hover:text-blue-300">Log in here</Link>
        </p>
      </div>
    </div>
  );
}