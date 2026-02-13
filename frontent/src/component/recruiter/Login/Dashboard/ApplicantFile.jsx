import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { SoftContext } from "../../../../../context/SoftContext";
import { Sidebar } from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../config/api";


/* Reusable info row */
const InfoRow = ({ label, value }) => (
  <p className="flex justify-between text-sm sm:text-base">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-900">{value}</span>
  </p>
);

export const ApplicantFile = () => {
  const { token } = useContext(SoftContext);
  const { id } = useParams();
  const navigate = useNavigate();


  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("Submitted");
  const [notes, setNotes] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [showResume, setShowResume] = useState(false);

  const handleScheduleInterview = async () => {
    if (!interviewDate || !interviewTime) {
      alert("Please select interview date and time");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/recruiter/schedule-interview/${applicant._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            interviewDate,
            interviewTime,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setStatus("Interview Scheduled");
        navigate("/recruiter/applications");

       
      }
    } catch (err) {
      console.log(err);
      alert("Failed to schedule interview");
    }
  };

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/recruiter/application/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setApplicant(data.applicant);
        setStatus(data.applicant.status || "Submitted");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchApplicant();
  }, [id, token]);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus); // update local UI
    try {
      const res = await fetch(
        `${API_URL}/api/recruiter/update-status/${applicant._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      console.log(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!applicant)
    return <p className="p-6 text-red-500">Applicant not found</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <img
            src={applicant.applicantPhoto}
            alt="Applicant"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-blue-500"
          />

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {applicant.fullName}
            </h2>
            <p className="text-gray-600">{applicant.email}</p>
            <p className="text-gray-600">{applicant.phone}</p>

            <span className="inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 transition">
              {status}
            </span>
          </div>
        </div>

        {/* ================= ACTION BAR ================= */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col lg:flex-row gap-4 justify-between transition hover:shadow-lg">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option>Submitted</option>
              <option>Shortlisted</option>
              <option>Interview Scheduled</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleStatusChange("Accepted")}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition active:scale-95"
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusChange("Shortlisted")}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition active:scale-95"
            >
              Shortlist
            </button>

            <button
              onClick={() => handleStatusChange("Rejected")}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition active:scale-95"
            >
              Reject
            </button>
            <button
              onClick={() => setShowResume(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition active:scale-95"
            >
              View Resume
            </button>
          </div>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                PI
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow label="Date of Birth" value={applicant.dob} />
              <InfoRow label="Gender" value={applicant.gender} />
              <InfoRow label="Father's Name" value={applicant.fatherName} />
              <InfoRow label="Mother's Name" value={applicant.motherName} />
              <InfoRow label="Address" value={applicant.address} />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center font-bold">
                ED
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Education</h3>
            </div>

            <div className="space-y-4">
              {applicant.education.map((edu) => (
                <div
                  key={edu._id}
                  className="relative border-l-4 border-green-500 bg-gray-50 rounded-xl p-4 pl-6 hover:bg-green-50 transition"
                >
                  <p className="font-semibold text-gray-900">
                    {edu.qualification}
                  </p>
                  <p className="text-sm text-gray-600">{edu.college}</p>
                  <p className="text-sm text-gray-500">
                    {edu.passingYear} • Grade: {edu.grade}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                EX
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Experience
              </h3>
            </div>

            <div className="space-y-4">
              {applicant.experience.map((exp) => (
                <div
                  key={exp._id}
                  className="border rounded-2xl p-4 hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-900">{exp.role}</p>
                    <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                      {exp.years} yrs
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Skills: {exp.skills}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Interview */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
              Schedule Interview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Interview Date
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Interview Time
                </label>
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleScheduleInterview}
              className="mt-5 w-full sm:w-auto px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition active:scale-95"
            >
              Schedule Interview
            </button>
          </div>
        </div>

        {applicant.job && (
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">
              Job Applied For
            </h3>

            {/* Job Title */}
            <div>
              <p className="text-xl font-semibold text-gray-900">
                {applicant.job.jobTitle}
              </p>
              <p className="text-sm text-gray-600">
                {applicant.job.companyName}
              </p>
            </div>

            {/* Job Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <p>
                <span className="font-medium text-gray-600">Location:</span>{" "}
                {applicant.job.location}
              </p>
              <p>
                <span className="font-medium text-gray-600">Type:</span>{" "}
                {applicant.job.employmentType}
              </p>
              <p>
                <span className="font-medium text-gray-600">Salary:</span>{" "}
                {applicant.job.salary}
              </p>
            </div>

            {/* Skills */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Required Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {applicant.job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= RESUME MODAL ================= */}
      {showResume && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] relative animate-[scaleIn_0.2s_ease-out]">
            <button
              onClick={() => setShowResume(false)}
              className="absolute top-3 right-3 text-xl font-bold"
            >
              ✕
            </button>
            <iframe
              src={applicant.resumeUrl}
              title="Resume"
              className="w-full h-full rounded-b-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
