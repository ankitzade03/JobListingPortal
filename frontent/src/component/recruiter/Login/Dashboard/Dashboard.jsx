
// src/components/admin/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
  XAxis,
  Bar,
  Line,
  BarChart,
  LineChart,
} from "recharts";

import { SoftContext } from "../../../../../context/SoftContext";
import { Sidebar } from "./Sidebar";
import { API_URL } from "../../../../config/api";

// Safe nested property extractor (to avoid eval)
function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) || "—";
}

export const AdminDashboard = () => {
  const { token } = useContext(SoftContext);

  const [payload, setPayload] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function fetchRecruiterDashboard() {
    try {
      const res = await fetch(`${API_URL}/api/recruiter/dashboard`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("API request failed");
      return await res.json();
    } catch (err) {
      console.error("Dashboard API error:", err);
      return null;
    }
  }

  useEffect(() => {
    async function loadDashboard() {
      const data = await fetchRecruiterDashboard();
      if (data) {
        setPayload(data);
        setTimeout(() => setLoaded(true), 100);
      }
    }
    loadDashboard();
  }, []);

  if (!payload) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-200 animate-pulse mx-auto mb-3"></div>
            <p className="text-gray-600 text-lg">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, latest, graphData } = payload;

  // === FIX: normalize stats ===
  const jobStatusData = (stats.jobStatusStats || []).map((s) => ({
    name: s?._id === null ? "Pending" : s?._id || "Unknown",
    value: s?.count || 0,
  }));

  const appStatusData = (stats.applicationStatusStats || []).map((s) => ({
    name: s?._id || "Unknown",
    value: s?.count || 0,
  }));

  const COLORS = ["#6366F1", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 p-3 lg:ml-3 min-h-screen bg-gray-50 transition-all duration-300">

        {/* === HEADER (IMPROVED: sticky + shadow) === */}
        <header
          className={`sticky top-0 bg-gray-50 z-20 py-4 mb-10 transition-all duration-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Recruiter Dashboard
          </h1>
          <p className="text-sm text-gray-500">Insights • Analytics • Overview</p>
        </header>

        {/* TOP METRICS */}
        <section
          className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-10 transition-all duration-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {[
            { title: "Jobseekers", value: stats.totalJobseekers, color: "from-indigo-500 to-indigo-700" },
            { title: "Recruiters", value: stats.totalRecruiters, color: "from-pink-500 to-rose-500" },
            { title: "Total Jobs", value: stats.totalJobs, color: "from-emerald-500 to-emerald-700" },
            { title: "Applications", value: stats.totalApplications, color: "from-yellow-500 to-orange-500" },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${item.color} transition-all hover:scale-[1.03]`}
            >
              <div className="text-sm opacity-80">{item.title}</div>
              <div className="text-4xl font-bold mt-2">{item.value ?? 0}</div>
            </div>
          ))}
        </section>

        {/* CHARTS */}
        <section className="grid gap-8 grid-cols-1 lg:grid-cols-2 mb-10">
          {/* Job Status */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-80">
            <h3 className="text-lg font-semibold mb-4">Job Status Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={jobStatusData} cx="50%" cy="50%" outerRadius={90} label>
                  {jobStatusData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* App Status */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-80">
            <h3 className="text-lg font-semibold mb-4">Application Status Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={appStatusData} cx="50%" cy="50%" outerRadius={90} label>
                  {appStatusData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[(idx + 1) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Jobs Bar */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-80 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Monthly Job Postings</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData?.monthlyJobs || []}>
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="count" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-80 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Application Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData?.monthlyApplications || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* LATEST ENTRIES */}
        <section className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {[
            { title: "Latest Jobseekers", data: latest.latestJobseekers, keys: ["name", "email", "createdAt"] },
            { title: "Latest Recruiters", data: latest.latestRecruiters, keys: ["name", "email", "createdAt"] },
            { title: "Latest Jobs", data: latest.latestJobs, keys: ["jobTitle", "companyName", "status"] },
            { title: "Latest Applications", data: latest.latestApplications, keys: ["fullName", "job.jobTitle", "status"] },
          ].map((section, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-500 border-b">
                      {section.keys.map((key) => (
                        <th key={key} className="py-2 capitalize">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(section.data || []).map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        {section.keys.map((key) => (
                          <td key={key} className="py-2 text-sm text-gray-700">
                            {getNestedValue(item, key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
