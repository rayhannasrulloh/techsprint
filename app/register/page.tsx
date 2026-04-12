// File: src/app/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Users, Zap, User, UserPlus, Building, CreditCard, Link as LinkIcon, Upload, MessageSquare, Phone, AlertTriangle, CheckCircle2, X, Eye, EyeOff, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

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

  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  
  // Social Media Proofs (.pdf)
  const [igFollowFile, setIgFollowFile] = useState<File | null>(null);
  const [twibbonFile, setTwibbonFile] = useState<File | null>(null);
  const [igStoryFile, setIgStoryFile] = useState<File | null>(null);


  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- STATE MATA PASSWORD
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [message, setMessage] = useState("");
  

  // --- MAINTENANCE MODE TOGGLE ---
  const isMaintenanceMode = false;

  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0f24] via-[#050814] to-black flex flex-col items-center justify-center p-6 text-white font-sans py-20 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <Link href="/" className="z-10 -mt-20 mb-10 flex items-center justify-center transition-transform hover:scale-105 duration-300">
          <img src="/logo-techsprint-2026.png" alt="Logo" className="w-32 h-32 object-contain" />
        </Link>

        <div className="z-10 max-w-xl w-full bg-gradient-to-b from-gray-900/40 to-gray-800/10 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
             <AlertTriangle className="w-10 h-10 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
          </div>
          <h2 className="text-3xl font-light tracking-wide mb-3 text-white uppercase">Maintenance Mode</h2>
          <p className="text-gray-400 font-light leading-relaxed mb-8">
            Our registration service is currently offline for scheduled maintenance and upgrades. Please check back again later.
          </p>
          <Link href="/" className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white transition-all duration-300 text-sm font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Helper untuk validasi ukuran file (10MB = 10 * 1024 * 1024 bytes)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateFile = (file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE) {
      toast.error(`File "${file.name}" is too large! Maximum 10MB.`);
      return false;
    }
    return true;
  };

  // 1. Tahan submit form dan buka modal konfirmasi
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentFile || !idCardFile || !igFollowFile || !twibbonFile || !igStoryFile) {
      toast.error("Please upload all payment proof and social media documents!");
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
        toast.loading("Uploading documents...", { id: toastId });
        const userId = authData.user.id;

        // Fungsi pembantu untuk upload file ke bucket payment_proofs
        const uploadDoc = async (file: File, prefix: string) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${userId}_${prefix}_${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('payment_proofs').upload(fileName, file);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('payment_proofs').getPublicUrl(fileName);
          return data.publicUrl;
        };

        // Upload semua file secara paralel agar cepat
        const [paymentUrl, idCardUrl, igFollowUrl, twibbonUrl, igStoryUrl] = await Promise.all([
          uploadDoc(paymentFile!, 'payment'),
          uploadDoc(idCardFile!, 'id_card'),
          uploadDoc(igFollowFile!, 'ig_follow'),
          uploadDoc(twibbonFile!, 'twibbon'),
          uploadDoc(igStoryFile!, 'ig_story')
        ]);

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
          payment_proof_url: paymentUrl,
          id_card_proof_url: idCardUrl,
          ig_follow_proof_url: igFollowUrl,   // URL PDF Follow IG
          twibbon_proof_url: twibbonUrl,      // URL PDF Twibbon
          ig_story_proof_url: igStoryUrl,     // URL PDF Story & Comment
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
            <button onClick={() => setShowConfirmModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
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

      <Link href="/" className="-mt-20 flex items-center justify-center">
        <img src="/logo-techsprint-2026.png" alt="Logo" className="w-30 h-30" />
      </Link>

      <div className="max-w-4xl w-full bg-gradient-to-b from-gray-900/30 to-gray-700/10 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md">
        <h2 className="text-4xl font-light tracking-wide mb-2 text-center uppercase">Registration</h2>
        <p className="text-gray-400 font-light text-sm text-center mb-10">Register your team and complete the payment to secure your spot.</p>

        <form onSubmit={handlePreSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* COLUMN 1 */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm tracking-widest border-b border-white/10 pb-2 uppercase">Team & Account</h3>
                <div className="relative"><Users className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name" className="w-full bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-300/50 outline-none" /></div>
                <div className="relative"><Building className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Institution / High School" className="w-full bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-300/50 outline-none" /></div>
                <div className="relative"><Mail className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-300/50 outline-none" /></div>

                <div className="relative">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (Min 6 chars)"
                    className="w-full bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm text-gray-200 focus:border-blue-300/50 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Zap className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                  <select value={track} onChange={(e) => setTrack(e.target.value)} className="w-full bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl py-3 pl-12 pr-10 text-sm text-gray-200 focus:border-blue-300/50 outline-none appearance-none">
                    <option value="UI/UX">UI/UX Design</option>
                    <option value="Data Automation">Data Automation</option>
                    <option value="System Analyst">System Analyst</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm tracking-widest border-b border-white/10 pb-2 uppercase">Leader Identity</h3>
                <div className="relative"><User className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={leaderName} onChange={(e) => setLeaderName(e.target.value)} placeholder="Leader Full Name" className="w-full bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-300/50 outline-none" /></div>
                <div className="relative"><Phone className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="tel" required value={leaderPhone} onChange={(e) => setLeaderPhone(e.target.value)} placeholder="Leader WhatsApp" className="w-full bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-300/50 outline-none" /></div>
                <div className="relative"><MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="text" required value={discordUsername} onChange={(e) => setDiscordUsername(e.target.value)} placeholder="Leader Discord Username" className="w-full bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-blue-300/50 outline-none" /></div>
              </div>

              {/* Team Members */}
              <div className="space-y-4">
                <h3 className="text-sm tracking-widest border-b border-white/10 pb-2 uppercase">Team Members</h3>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <UserPlus className="absolute left-3 top-4 w-4 h-4 text-gray-500" />
                    <input type="text" value={member2Name} onChange={(e) => setMember2Name(e.target.value)} placeholder="Member 2 Name" className="w-full bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-gray-200 focus:border-blue-300/50 outline-none" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <UserPlus className="absolute left-3 top-4 w-4 h-4 text-gray-500" />
                    <input type="text" value={member3Name} onChange={(e) => setMember3Name(e.target.value)} placeholder="Member 3 Name" className="w-full bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-gray-200 focus:border-blue-300/50 outline-none" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl p-4 mt-4">
                <p className="text-sm text-gray-200 mb-1 font-medium">Upload ID Cards</p>
                <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                  Combine ID Cards of all team members into a <strong>single PDF file</strong>.
                </p>
                <label className="flex items-center justify-between w-full bg-[#050814] border border-white/10 hover:border-blue-500/50 rounded-lg p-3 cursor-pointer transition-colors">
                  <span className="text-xs text-gray-400 truncate max-w-[200px]">
                    {idCardFile ? idCardFile.name : "Upload ID Cards (.pdf - Max 10MB)"}
                  </span>
                  <Upload className="w-4 h-4 text-gray-400" />
                  <input 
                    type="file" 
                    accept=".pdf" 
                    required 
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file && file.size > 10 * 1024 * 1024) {
                        toast.error("File too large! Maximum 10MB.");
                        e.target.value = "";
                      } else {
                        setIdCardFile(file);
                      }
                    }} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="space-y-6">


              {/* --- SOCIAL MEDIA REQUIREMENTS --- */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest border-b border-white/10 pb-2">Social Media Requirements</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Please compile the screenshot submissions from <strong>all team members</strong> (Team Leader & Members) into a <strong>single PDF document</strong> for each of the requirements listed below.
                </p>

                {/* 1. Follow IG */}
                <div className="bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-200 mb-1 font-medium">1. Proof of Instagram Follow</p>
                  <p className="text-xs text-gray-500 mb-3">All team members must follow our official Instagram account, @techsprint26. Max 10MB</p>
                  <label className="flex items-center justify-between w-full bg-[#050814] border border-white/10 hover:border-blue-500/50 rounded-lg p-3 cursor-pointer transition-colors">
                    <span className="text-xs text-gray-300 truncate max-w-[200px]">{igFollowFile ? igFollowFile.name : "Upload File (.pdf)"}</span>
                    <Upload className="w-4 h-4 text-gray-400" />
                    <input 
                      type="file" 
                      accept=".pdf" 
                      required 
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (validateFile(file)) {
                          setIgFollowFile(file);
                        } else {
                          e.target.value = ""; // Reset input jika gagal
                        }
                      }} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* 2. Upload Twibbon */}
                <div className="bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-200 mb-1 font-medium">2. Proof of Twibbon Upload</p>
                  <p className="text-xs text-gray-500 mb-3">Screenshots of the Twibbon posted on each member&apos;s respective Instagram feed. Max 10MB</p>
                  <p className="text-xs text-gray-500 mb-3">Link Twibbon: <Link href="https://bit.ly/TECHSPRINT3IN1TWIBBONLINK" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400">https://bit.ly/TECHSPRINT3IN1TWIBBONLINK</Link></p>
                  <label className="flex items-center justify-between w-full bg-[#050814] border border-white/10 hover:border-blue-500/50 rounded-lg p-3 cursor-pointer transition-colors">
                    <span className="text-xs text-gray-300 truncate max-w-[200px]">{twibbonFile ? twibbonFile.name : "Upload File (.pdf)"}</span>
                    <Upload className="w-4 h-4 text-gray-400" />
                    <input type="file" accept=".pdf"
                      required onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (validateFile(file)) {
                          setTwibbonFile(file);
                        } else {
                          e.target.value = ""; // Reset input jika gagal
                        }
                      }} className="hidden" />
                  </label>
                </div>

                {/* 3. Story, Comment & Tag */}
                <div className="bg-gradient-to-b from-black/30 to-blue-200/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-200 mb-1 font-medium">3. Proof of Instagram Story</p>
                  <p className="text-xs text-gray-500 mb-3">Screenshots of sharing the event poster on your Instagram Story. Max 10MB</p>
                  <label className="flex items-center justify-between w-full bg-[#050814] border border-white/10 hover:border-blue-500/50 rounded-lg p-3 cursor-pointer transition-colors">
                    <span className="text-xs text-gray-300 truncate max-w-[200px]">{igStoryFile ? igStoryFile.name : "Upload File (.pdf)"}</span>
                    <Upload className="w-4 h-4 text-gray-400" />
                    <input type="file" accept=".pdf"
                      required onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (validateFile(file)) {
                          setIgStoryFile(file);
                        } else {
                          e.target.value = ""; // Reset input jika gagal
                        }
                      }} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm tracking-widest uppercase border-b border-white/10 pb-2">Payment</h3>
                {/* <div className="relative"><LinkIcon className="absolute left-4 top-4 w-5 h-5 text-gray-500" /><input type="url" value={cvLink} onChange={(e) => setCvLink(e.target.value)} placeholder="Drive Link to CVs (Optional)" className="w-full bg-[#0a0f24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-green-500 outline-none" /></div>
                 */}
                <div className="bg-gradient-to-b from-green-500/10 to-green-950/10 border-t border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4 text-green-500">
                    <CreditCard className="w-5 h-5" /> <span className="font-semibold text-sm">Registration Fee</span>
                  </div>
                  
                  <div className="text-xs text-gray-300 leading-relaxed mb-5 space-y-3">
                    <p>Untuk secara resmi mengonfirmasi partisipasi Anda, silakan lakukan pembayaran sesuai kategori yang Anda pilih:</p>
                    <ul className="space-y-1 ml-1">
                      <li className="text-gray-500 line-through">🌟 (Periode telah berakhir) Early Bird (IDR 130.000) (khusus untuk 5 tim pertama, kuota terbatas!)</li>
                      <li className="text-green-400 font-medium tracking-wide">💼 Reguler (IDR 150.000)</li>
                    </ul>
                    <p>Silakan transfer jumlah yang tepat ke rekening yang tercantum di bawah ini dan unggah bukti pembayaran Anda setelah transaksi selesai. Pendaftaran Anda akan berhasil diproses hanya setelah verifikasi pembayaran.</p>
                    <p className="text-yellow-500/90 font-medium">⚠️ Harap diperhatikan bahwa semua pembayaran tidak dapat dikembalikan.</p>
                  </div>

                  <p className="text-xs text-gray-400 text-center">Please transfer to:</p>
                  <img src="/img/qris-techsprint.jpeg" alt="QRIS" className="w-64 mx-auto my-3" />
                  <p className="text-white text-base tracking-widest text-center font-medium">Rp. 150.000/Team</p>
                  <p className="text-gray-400 mb-4 text-center text-xs">QRIS a.n CHIBI MARUKO-CHAN</p>

                  <label className="flex items-center justify-center gap-2 w-full bg-gradient-to-b from-green-400/10 to-green-950/10 border border-dashed border-white/20 hover:border-green-500/50 hover:bg-green-500/10 rounded-lg p-3 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-300 truncate max-w-[200px]">{paymentFile ? paymentFile.name : "Upload Payment Receipt (Image)"}</span>
                    <input type="file" accept="image/*"
                      required onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (validateFile(file)) {
                          setPaymentFile(file);
                        } else {
                          e.target.value = ""; // Reset input jika gagal
                        }
                      }} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center mt-8 text-lg bg-gradient-to-t from-blue-600/90 to-[#001188] py-4 rounded-xl font-normal shadow-[0_0_10px_rgba(0,51,255,0.3)] hover:shadow-[0_0_20px_rgba(0,51,255,0.6)] transition-all duration-300 disabled:opacity-50 cursor-pointer">
            {isLoading ? message : "Register"}
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