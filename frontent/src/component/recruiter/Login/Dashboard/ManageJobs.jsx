

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { SoftContext } from "../../../../../context/SoftContext";
import { API_URL } from "../../../../config/api";

export const ManageJobs = () => {
  const { token } = useContext(SoftContext);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobApplicationCounts = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/recruiter/applications/count-by-job`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setJobs(data.jobs || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobApplicationCounts();
  }, []);

  

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Manage Jobs</h1>

        <div className="bg-white p-6 rounded-2xl shadow">
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-500">No jobs found</p>
          ) : (
            <table className="w-full border-collapse">
              <thead className="text-sm text-gray-500 border-b">
                <tr>
                  <th className="p-3 text-left">Job Title</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-center">Applications</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.jobId}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <div className="font-medium">{job.jobTitle}</div>
                      <div className="text-xs text-gray-500">
                        ID: {job.jobId}
                      </div>
                    </td>

                    <td className="p-3">{job.location}</td>

                    <td className="p-3 text-center">
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700">
                        {job.totalApplications}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() =>
                          navigate(`/recruiter/job/${job.jobId}/applications`)
                        }
                        className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};
