

import React from "react";
import { Bell, User, ChevronDown } from "lucide-react";

export const RecruiterHeader = () => {
  return (
    <header className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white px-8 py-5 shadow-lg overflow-hidden">
      
      {/* Background Animated Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent animate-pulse pointer-events-none"></div>

      <div className="relative flex items-center justify-between">
        
        {/* LEFT SECTION */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-wide">
            Recruiter Dashboard
          </h1>
          <p className="text-sm text-indigo-100">
            Manage jobs, track applications & streamline hiring
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-6">
          
          {/* Notification Button */}
          <button className="relative p-2 rounded-full hover:bg-white/20 transition duration-300 hover:scale-110">
            <Bell size={22} />
            
            {/* Animated Dot */}
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </button>

          {/* Profile Section */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full cursor-pointer hover:bg-white/20 transition duration-300 hover:scale-105 shadow-md">
            
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
              <User size={18} />
            </div>

            <div className="hidden md:block leading-tight">
              <p className="text-sm font-semibold">HR Manager</p>
              <p className="text-xs text-indigo-100">Recruiter</p>
            </div>

            <ChevronDown size={16} className="hidden md:block opacity-80" />
          </div>
        </div>
      </div>
    </header>
  );
};
