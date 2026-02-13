
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  FilePlus,
  Users,
  FileText,
  Settings,
  LifeBuoy,
  BarChart2,
  LogOut,
} from "lucide-react";
import { SoftContext } from "../../../../../context/SoftContext";

const menu = [
  { name: "Dashboard", icon: LayoutGrid, to: "/recruiter/dashboard" },
  { name: "Post Job", icon: FilePlus, to: "/recruiter/post-job" },
  { name: "Applications", icon: Users, to: "/recruiter/applications" },
  { name: "Manage Jobs", icon: FileText, to: "/recruiter/manage-jobs" },
  { name: "Analytics", icon: BarChart2, to: "/recruiter/analytics" },
  { name: "Company Profile", icon: Settings, to: "/recruiter/company-profile" },
  { name: "Support", icon: LifeBuoy, to: "/recruiter/support" },
];

export const Sidebar = () => {
  const { setToken, setRole } = useContext(SoftContext);
  const loc = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear context
    setToken(null);
    setRole(null);
    // Redirect
    navigate("");
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white min-h-screen p-6 hidden md:flex flex-col">

      {/* MENU */}
      <nav className="flex-1 space-y-2">
        {menu.map((m) => {
          const Icon = m.icon;
          const active = loc.pathname === m.to;

          return (
            <Link
              key={m.name}
              to={m.to}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                active ? "bg-white/15" : "hover:bg-white/10"
              }`}
            >
              <div className="p-2 bg-white/10 rounded-md">
                <Icon size={18} />
              </div>
              <span className="font-medium">{m.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 mt-6 px-4 py-3 rounded-lg bg-red-500/15 hover:bg-red-500/25 transition text-red-200"
      >
        <LogOut size={18} />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
};
