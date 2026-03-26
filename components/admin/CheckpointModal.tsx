import { AlertTriangle, CheckCircle2, ExternalLink, Github, X } from "lucide-react";

export default function CheckpointModal({ 
  isOpen, onClose, selectedCp, onReview 
}: { 
  isOpen: boolean, onClose: () => void, selectedCp: any, onReview: (id: string) => void 
}) {
  if (!isOpen || !selectedCp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0c122b] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#080c1f]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-light text-white">{selectedCp.team_name}</h2>
              <span className="text-[10px] px-2 py-0.5 bg-blue-900/30 text-blue-300 border border-blue-500/20 rounded-md">{selectedCp.track}</span>
            </div>
            <p className="text-gray-400 text-sm">Checkpoint {selectedCp.checkpoint_number} Submission Preview</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className={`p-4 rounded-xl border flex items-center gap-4 ${selectedCp.isLate ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
            {selectedCp.isLate ? <AlertTriangle className="w-8 h-8 text-red-400" /> : <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
            <div>
              <h3 className={`font-medium ${selectedCp.isLate ? 'text-red-400' : 'text-emerald-400'}`}>
                {selectedCp.isLate ? "LATE SUBMISSION" : "ON TIME SUBMISSION"}
              </h3>
              <p className="text-sm font-light text-gray-300 mt-1">
                Submitted at: <strong className="text-white">{new Date(selectedCp.submitTime).toLocaleString()}</strong><br/>
                Deadline was: <strong className="text-gray-400">{new Date(selectedCp.deadline).toLocaleString()}</strong>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Progress Report</h4>
            <div className="bg-[#050814] border border-white/5 rounded-xl p-4 text-gray-300 text-sm font-light whitespace-pre-wrap">{selectedCp.report_text}</div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Repository</h4>
            <a href={selectedCp.github_link} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[#050814] border border-white/5 hover:border-blue-500/30 rounded-xl p-4 transition-colors group">
              <Github className="w-6 h-6 text-gray-400 group-hover:text-blue-400" />
              <span className="text-sm font-light text-blue-400 group-hover:underline truncate">{selectedCp.github_link}</span>
              <ExternalLink className="w-4 h-4 text-gray-500 ml-auto group-hover:text-blue-400" />
            </a>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-[#080c1f] flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-colors">Close</button>
          {!selectedCp.is_reviewed && (
            <button onClick={() => onReview(selectedCp.id)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              Mark as Reviewed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}