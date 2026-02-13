import React, { useEffect, useState, useContext } from "react";
import { SoftContext } from "../../../../../context/SoftContext";
import { Sidebar } from "./Sidebar";
import { API_URL } from "../../../../config/api";

export const Applications = () => {
  const { token } = useContext(SoftContext);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: "",
    role: "",
    skills: "",
    search: "",
    sortBy: "",
  });

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(
        `${API_URL}/api/recruiter/applications?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      console.log("data of users:", data);
      setApplications(data.applications || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* FILTERS BAR */}
        <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-wrap gap-3 items-center overflow-x-auto whitespace-nowrap border border-gray-200">
          <select
            name="status"
            onChange={handleFilterChange}
            className="filter-item"
          >
            <option value="">Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          <input
            name="role"
            type="text"
            placeholder="Role (e.g. Full Stack)"
            className="filter-item"
            onChange={handleFilterChange}
          />

          <input
            name="skills"
            type="text"
            placeholder="Skills (React, JS)"
            className="filter-item"
            onChange={handleFilterChange}
          />

          <input
            name="search"
            type="text"
            placeholder="Search name/email"
            className="filter-item"
            onChange={handleFilterChange}
          />

          <select
            name="sortBy"
            onChange={handleFilterChange}
            className="filter-item"
          >
            <option value="">Sort By</option>
            <option value="newest">Newest</option>
            <option value="experience">Experience</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* APPLICATIONS LIST */}
        <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            All Applications
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : applications.length === 0 ? (
            <p className="text-gray-500">No applications found.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-semibold">
                    <th className="p-3 text-left">Candidate</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Experience</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      className="border-b hover:bg-indigo-50 transition duration-200"
                    >
                      {/* Candidate */}
                      <td className="p-3">
                        <div className="font-semibold text-gray-800">
                          {app.fullName || app.applicant?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {app.email || app.applicant?.email}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-3">
                        {app.job?.jobTitle || "Not specified"}
                      </td>

                      {/* Experience */}
                      <td className="p-3">
                        {app.experience?.length > 0
                          ? `${app.experience[0].years} yrs`
                          : "Fresher"}
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                            app.status === "Submitted"
                              ? "bg-blue-500"
                              : app.status === "Under Review"
                                ? "bg-yellow-500"
                                : app.status === "Shortlisted"
                                  ? "bg-purple-600"
                                  : app.status === "Selected"
                                    ? "bg-green-600"
                                    : "bg-red-600"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-3 text-center">
                        <button
                          className="px-4 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                          onClick={() =>
                            window.location.assign(
                              `/recruiter/application/${app._id}`,
                            )
                          }
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
