

import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SoftContext } from "../../../context/SoftContext";
import { API_URL } from "../../config/api";

const statusColors = {
  Submitted: "bg-gray-100 text-gray-700",
  Shortlisted: "bg-blue-100 text-blue-700",
  "Interview Scheduled": "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const MyApplications = () => {
  const { token } = useContext(SoftContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/jobseeker/my-applications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch applications");

        const data = await res.json();

        // 🔥 Filter out applications where job is null
        const validApplications = data.applications.filter(
          (app) => app.job
        );

        setApplications(validApplications);
      } catch (error) {
        console.error("Error fetching applications", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">
        Loading applications...
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {applications.length === 0 ? (
        <p className="text-gray-500 text-center mt-10 text-lg">
          No applications found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between"
            >
              {/* Status Badge */}
              <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[app.status] ||
                  "bg-gray-100 text-gray-700"
                }`}
              >
                {app.status}
              </span>

              {/* Job Info */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={
                    app.job?.companyLogo ||
                    "https://via.placeholder.com/60"
                  }
                  alt="Company Logo"
                  className="w-14 h-14 rounded-lg object-contain border p-1"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {app.job?.jobTitle}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {app.job?.companyName} • {app.job?.location}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                    <span>🧑‍💻 {app.job?.workMode}</span>
                    <span>⏱ {app.job?.employmentType}</span>
                    <span>💼 {app.job?.experience}</span>
                    <span>💰 {app.job?.salary}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex flex-wrap gap-3 text-sm">
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Resume
                    </a>
                  )}

                  {app.coverLetter && (
                    <span className="text-gray-600 italic">
                      Cover Letter: {app.coverLetter}
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-400">
                  Applied on{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
