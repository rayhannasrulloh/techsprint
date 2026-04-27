"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Settings, ShieldAlert, CheckCircle2, Power, PowerOff } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "maintenance_mode")
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No row found, default to false
          setIsMaintenanceMode(false);
        } else {
          throw error;
        }
      } else if (data) {
        // Handle boolean or string boolean depending on how it was saved
        setIsMaintenanceMode(data.value === true || data.value === "true");
      }
    } catch (err: any) {
      toast.error(`Error fetching settings: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMaintenance = async () => {
    setIsSaving(true);
    const newValue = !isMaintenanceMode;
    const toastId = toast.loading("Updating settings...");

    try {
      const { error } = await supabase
        .from("app_settings")
        .upsert({ key: "maintenance_mode", value: newValue });

      if (error) throw error;

      setIsMaintenanceMode(newValue);
      toast.success(`Maintenance mode ${newValue ? "enabled" : "disabled"}`, { id: toastId });
    } catch (err: any) {
      toast.error(`Error saving settings: ${err.message}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[90rem] mx-auto animate-in fade-in duration-500 p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-medium flex items-center gap-3">
            Application Settings
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage global system configurations</p>
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-emerald-400 text-sm animate-pulse">Loading settings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Maintenance Mode Card */}
          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6 relative overflow-hidden shadow-sm">
            {isMaintenanceMode && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-bl-full pointer-events-none" />
            )}
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-lg ${isMaintenanceMode ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {isMaintenanceMode ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${isMaintenanceMode ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                {isMaintenanceMode ? "MAINTENANCE ON" : "ACTIVE"}
              </span>
            </div>

            <h3 className="text-xl font-medium text-white mb-2">Registration Status</h3>
            <p className="text-sm text-gray-400 mb-6 min-h-[60px]">
              When maintenance mode is active, the registration page will be blocked and users will see a maintenance screen.
            </p>

            <button
              onClick={handleToggleMaintenance}
              disabled={isSaving}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all shadow-sm ${
                isMaintenanceMode 
                  ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white" 
                  : "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500"
              } disabled:opacity-50`}
            >
              {isMaintenanceMode ? (
                <>
                  <Power className="w-4 h-4 text-emerald-400" /> Re-open Registration
                </>
              ) : (
                <>
                  <PowerOff className="w-4 h-4" /> Close Registration (Maintenance)
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
