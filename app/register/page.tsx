// File: src/app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Users, Zap, User, UserPlus, Building, CreditCard, Link as LinkIcon, Upload, MessageSquare, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  
  // Account & General Info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState("UI/UX");
  const [institution, setInstitution] = useState("");
  
  // Leader Data
  const [leaderName, setLeaderName] = useState("");
  const [leaderNim, setLeaderNim] = useState("");
  const [leaderPhone, setLeaderPhone] = useState(""); // State baru untuk nomor HP
  const [discordUsername, setDiscordUsername] = useState("");
  
  // Member 2 Data
  const [member2Name, setMember2Name] = useState("");
  const [member2Nim, setMember2Nim] = useState("");
  
  // Member 3 Data
  const [member3Name, setMember3Name] = useState("");
  const [member3Nim, setMember3Nim] = useState("");

  // Documents & Payment
  const [cvLink, setCvLink] = useState("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentFile) {
      setMessage("❌ Please upload your payment proof.");
      return;
    }

    setIsLoading(true);
    setMessage("Creating account...");

    try {
      // 1. Sign up the user (Team Leader)
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;

      if (authData.user) {
        // 2. Upload Payment Proof to Supabase Storage
        setMessage("Uploading payment proof...");
        const fileExt = paymentFile.name.split('.').pop();
        const fileName = `${authData.user.id}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('payment_proofs')
          .upload(fileName, paymentFile);

        if (uploadError) throw uploadError;

        // Get Public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('payment_proofs')
          .getPublicUrl(fileName);
        
        const paymentUrl = publicUrlData.publicUrl;

        // 3. Insert FULL team data into 'teams' table
        setMessage("Saving team data...");
        const { error: dbError } = await supabase
          .from("teams")
          .insert([{
              id: authData.user.id,
              team_name: teamName,
              track: track,
              institution: institution,
              leader_email: email,
              leader_name: leaderName,
              leader_nim: leaderNim,
              leader_phone: leaderPhone, // Insert data nomor HP
              discord_username: discordUsername,
              member1_name: member2Name, 
              member2_nim: member2Nim,
              member2_name: member3Name, 
              member3_nim: member3Nim,
              cv_link: cvLink,
              payment_proof_url: paymentUrl,
              status: 'pending'
          }]);

        if (dbError) throw dbError;
      }

      setMessage("✅ Registration successful! Please wait for admin to verify your payment.");
      setTimeout(() => router.push("/login"), 3000);

    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f24] via-[#050814] to-black flex flex-col items-center justify-center p-6 text-white font-sans py-20">
      <Link href="/" className="absolute top-8 left-8 text-xl font-light tracking-widest text-gray-200">
        3IN1<span className="text-blue-500 font-medium">TECH</span>
      </Link>

      <div className="max-w-4xl w-full bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-light tracking-wide mb-2 text-center">Join the Sprint</h2>
        <p className="text-gray-400 font-light text-sm text-center mb-10">Register your team and complete the payment to secure your spot.</p>

        <form onSubmit={handleRegister} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* COLUMN 1: Account, Track, & Leader Info */}
            <div className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-widest border-b border-white/10 pb-2">Team & Account</h3>
                <div className="relative"><Users className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-500 outline-none" /></div>
                <div className="relative"><Building className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Institution / University / High School" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-500 outline-none" /></div>
                <div className="relative"><Mail className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Leader Email (For Login)" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-500 outline-none" /></div>
                <div className="relative"><Lock className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (Min 6 chars)" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-500 outline-none" /></div>
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
                <div className="relative"><Phone className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="tel" required value={leaderPhone} onChange={(e) => setLeaderPhone(e.target.value)} placeholder="Leader WhatsApp / Phone Number" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-emerald-500 outline-none" /></div>
                <div className="relative"><MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={discordUsername} onChange={(e) => setDiscordUsername(e.target.value)} placeholder="Leader Discord Username" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-emerald-500 outline-none" /></div>
              </div>

            </div>

            {/* COLUMN 2: Members, Docs, & Payment */}
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
                    <span className="text-xs text-gray-300">{paymentFile ? paymentFile.name : "Upload Payment Receipt (Image)"}</span>
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