
import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SoftContext } from "../../../context/SoftContext";
import { API_URL } from "../../config/api";

export const JobIdDetials = () => {
  const { id } = useParams();
  const { token } = useContext(SoftContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/jobseeker/job/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        
        if (data.success) setJob(data.job);

        console.log("data=",data)


      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading job details...
      </div>
    );

  if (!job)
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Job not found
      </div>
    );

  return (
    <div className="bg-emerald-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= LEFT : JOB CONTENT (SCROLL) ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* Header */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="flex items-center gap-4">
              <img
                src={job.companyLogo}
                alt="company logo"
                className="w-16 h-16 rounded-xl object-contain border"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {job.jobTitle}
                </h1>
                <p className="text-gray-600">{job.companyName}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              <span className="tag">📍 {job.location}</span>
              <span className="tag">💼 {job.employmentType}</span>
              <span className="tag">🧑‍💻 {job.workMode}</span>
              <span className="tag">💰 {job.salary}</span>
              <span className="tag">⏳ {job.experience}</span>
            </div>
          </div>

          {/* About Role */}
          <Section title="About the Role">
            <p>{job.aboutRole}</p>
          </Section>

          {/* Responsibilities */}
          <Section title="Responsibilities">
            <ul className="list-disc pl-5 space-y-1">
              {job.responsibilities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          {/* Requirements */}
          <Section title="Requirements">
            <ul className="list-disc pl-5 space-y-1">
              {job.requirements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          {/* Skills */}
          <Section title="Skills Required">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span key={i} className="skill">
                  {skill}
                </span>
              ))}
            </div>
          </Section>

          {/* Company Overview */}
          <Section title="About the Company">
            <p>{job.companyOverview}</p>
            <a
              href={job.website}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 font-medium underline"
            >
              Visit Website
            </a>
          </Section>
        </div>

        {/* ================= RIGHT : APPLY CARD (STICKY) ================= */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">

            <div className="bg-white rounded-2xl p-6 shadow space-y-4">
              <Link
                to={`/jobseeker/apply/${job._id}`}
                className="block w-full py-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
              >
                Apply Now
              </Link>

              <InfoRow label="Applied" value={job.applications.length} />
              <InfoRow label="Openings" value={job.openings} />
              <InfoRow label="Deadline" value={new Date(job.deadline).toDateString()} />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-semibold mb-2">Eligibility</h3>
              <p className="text-sm text-gray-600">
                Undergraduate • Engineering • CS / IT background preferred
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================== REUSABLE ================== */

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl p-6 shadow">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <div className="text-gray-700 leading-relaxed">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

/* Tailwind helpers */
const style = document.createElement("style");
style.innerHTML = `
.tag{
  padding:6px 12px;
  background:#f1f5f9;
  border-radius:9999px;
  font-size:12px;
}
.skill{
  padding:6px 12px;
  background:#eef2ff;
  color:#4338ca;
  border-radius:9999px;
  font-size:12px;
  font-weight:500;
}
`;
document.head.appendChild(style);
