
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { SoftContext } from "../../../../../context/SoftContext";
import { Sidebar } from "./Sidebar";
import { API_URL } from "../../../../config/api";

export const ApplicationsUsers = () => {
  const { token } = useContext(SoftContext);
  const { jobId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/recruiter/job/${jobId}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    try {
      await fetch(
        
        `${API_URL}/api/recruiter/application/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchApplications(); // refresh list
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  useEffect(() => {
    if (jobId && token) fetchApplications();
  }, [jobId, token]);

  if (loading) {
    return <p className="p-6 text-gray-600">Loading applications...</p>;
  }

  if (!data) {
    return <p className="p-6 text-gray-600">No applications found</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 space-y-6">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold text-gray-800">
            {data.jobTitle}
          </h1>
          <p className="text-gray-600 mt-1">
            Total Applications:{" "}
            <span className="font-semibold">
              {data.totalApplications}
            </span>
          </p>
        </div>

        {/* APPLICATION CARDS */}
        <div className="space-y-4">
          {data.applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition flex flex-col md:flex-row justify-between gap-4"
            >
              {/* LEFT */}
              <div className="flex gap-4">
                <img
                  src={
                    app.applicantPhoto ||
                    app.applicant?.profilePicture ||
                    "https://via.placeholder.com/100"
                  }
                  alt="Applicant"
                  className="w-14 h-14 rounded-full object-cover border"
                />

                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-800">
                    {app.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">{app.email}</p>
                  <p className="text-sm text-gray-600">{app.phone}</p>

                  <p className="text-sm text-gray-600">
                    Experience:{" "}
                    {app.experience?.[0]?.years
                      ? `${app.experience[0].years} yrs`
                      : "N/A"}{" "}
                    | Skills:{" "}
                    {app.experience?.[0]?.skills || "N/A"}
                  </p>

                  {/* STATUS BADGE */}
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full
                      ${
                        app.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : app.status === "Shortlisted"
                          ? "bg-purple-100 text-purple-700"
                          : app.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-4 self-end md:self-center">
                {app.resumeUrl && (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Resume"
                  >
                    <Eye className="text-indigo-600 hover:text-indigo-800" />
                  </a>
                )}

                <button
                  onClick={() => deleteApplication(app._id)}
                  title="Delete Application"
                >
                  <Trash2 className="text-red-600 hover:text-red-800" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
