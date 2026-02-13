
import React, { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { SoftContext } from "../../../../../context/SoftContext";
import { Sidebar } from "./Sidebar";
import { API_URL } from "../../../../config/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const AnalysisDashboard = () => {
  const { token } = useContext(SoftContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/recruiter/analysis`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch analysis data");
        const result = await res.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [token]);

  // Prepare chart data if available
  const jobStatusData = data?.stats?.jobStatusStats.map((item) => ({
    name: item._id || "Undefined",
    value: item.count,
  })) || [];

  const applicationStatusData = data?.stats?.applicationStatusStats.map((item) => ({
    name: item._id,
    value: item.count,
  })) || [];

  const monthlyJobs = data?.graphData?.monthlyJobs.map((item) => ({
    month: `M${item._id.month || item._id}`,
    count: item.count,
  })) || [];

  const monthlyApplications = data?.graphData?.monthlyApplications.map((item) => ({
    month: `M${item._id.month || item._id}`,
    count: item.count,
  })) || [];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Recruiter Analysis Dashboard</h2>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-gray-500 text-lg">Loading graphs...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-white shadow rounded">
                <h3 className="font-semibold mb-2">Job Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={jobStatusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                      isAnimationActive
                    >
                      {jobStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 bg-white shadow rounded">
                <h3 className="font-semibold mb-2">Application Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                      isAnimationActive
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white shadow rounded">
                <h3 className="font-semibold mb-2">Monthly Jobs Posted</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyJobs}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#0088FE" isAnimationActive />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 bg-white shadow rounded">
                <h3 className="font-semibold mb-2">Monthly Applications Received</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyApplications}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#FF8042" isAnimationActive />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// export default AnalysisDashboard;
