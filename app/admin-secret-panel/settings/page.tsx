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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#1F2937] pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Application Settings
          </h1>
          <p className="text-sm text-gray-400/80 mt-1.5 font-light tracking-wide">Manage global system configurations</p>
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-500 text-sm animate-pulse">Loading settings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Maintenance Mode Card */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="p-3 rounded-xl bg-[#030712] border border-[#1F2937]">
                {isMaintenanceMode ? <ShieldAlert className="w-6 h-6 text-yellow-500" /> : <CheckCircle2 className="w-6 h-6 text-green-500" />}
              </div>
              <span className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${isMaintenanceMode ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'}`}>
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
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors ${
                isMaintenanceMode 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              } disabled:opacity-50`}
            >
              {isMaintenanceMode ? (
                <>
                  <Power className="w-4 h-4 text-white" /> Re-open Registration
                </>
              ) : (
                <>
                  <PowerOff className="w-4 h-4 text-white" /> Close Registration (Maintenance)
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
