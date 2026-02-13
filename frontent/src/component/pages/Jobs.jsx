

import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SoftContext } from "../../../context/SoftContext";
import { Menu, X } from "lucide-react";
import { API_URL } from "../../config/api";

/* ================= JOB LIST ================= */

export const JobList = () => {
  const { token: ctxToken } = useContext(SoftContext);
  const token = ctxToken || localStorage.getItem("token");

  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    category: [],
    workMode: [],
    employmentType: [],
    location: [],
  });

  const [saved, setSaved] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 4;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  /* ================= FETCH JOBS ================= */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/jobseeker/jobs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  /* ================= READ URL PARAMS (🔥 NEW) ================= */

  useEffect(() => {
    const title = searchParams.get("title") || "";
    const category = searchParams.get("category");
    const location = searchParams.get("location");

    if (title) setSearchTerm(title);

    setFilters((prev) => ({
      ...prev,
      category: category ? [category] : prev.category,
      location: location ? [location] : prev.location,
    }));
  }, [searchParams]);

  /* ================= FILTER TOGGLE ================= */

  const toggle = (key, value) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  /* ================= FILTER LOGIC ================= */

  const filteredJobs = useMemo(() => {
    let list = [...jobs];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (j) =>
          j.jobTitle.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q)
      );
    }

    Object.entries(filters).forEach(([key, values]) => {
      if (!values.length) return;
      list = list.filter((j) => values.includes(j[key]));
    });

    return list;
  }, [jobs, searchTerm, filters]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredJobs.length / perPage);

  const paginatedJobs = filteredJobs.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* ================= UTILS ================= */

  const daysLeft = (d) =>
    Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

  const postedDate = (d) =>
    Math.ceil((new Date() - new Date(d)) / 86400000) + " days ago";

  /* ================= FILTER OPTIONS ================= */

  const categories = [...new Set(jobs.map((j) => j.category))];
  const workModes = [...new Set(jobs.map((j) => j.workMode))];
  const jobTypes = [...new Set(jobs.map((j) => j.employmentType))];
  const locations = [...new Set(jobs.map((j) => j.location))];

  return (
    <div className="bg-gray-100">
      {/* MOBILE FILTER BUTTON */}
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        <Menu size={20} />
      </button>

      <div className="flex h-[calc(100vh-80px)] px-[1cm] py-6 gap-6">
        {/* ================= SIDEBAR ================= */}
        <aside className="hidden md:flex w-[280px] bg-white rounded-xl p-5 shadow h-full flex-col">
          <SidebarContent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            toggle={toggle}
            categories={categories}
            workModes={workModes}
            jobTypes={jobTypes}
            locations={locations}
          />
        </aside>

        {/* ================= JOB LIST ================= */}
        <main className="flex-1 space-y-4 overflow-y-auto pr-2">
          {loading && (
            <div className="text-center text-gray-500 mt-10">
              Loading jobs...
            </div>
          )}

          {!loading &&
            paginatedJobs.map((job) => (
              <article
                key={job._id}
                className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition"
              >
                {/* TOP */}
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {job.jobTitle}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {job.companyName}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                      <span>🧳 {job.experience || "No experience"}</span>
                      <span>🧑‍💻 {job.workMode}</span>
                      <span>⏱ {job.employmentType}</span>
                      <span>📍 {job.location}</span>
                    </div>

                    {/* SKILLS */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.skills?.slice(0, 4).map((s, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col items-end gap-4">
                    <img
                      src={job.companyLogo || "https://via.placeholder.com/80"}
                      alt="logo"
                      className="w-14 h-14 object-contain border rounded-lg"
                    />
                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold text-sm">
                      ₹ {job.salary}
                    </span>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
                  <div className="flex gap-6">
                    <span>Posted {postedDate(job.createdAt)}</span>
                    <span>⏳ {daysLeft(job.deadline)} days left</span>
                    <span>👥 {job.applications?.length || 0} Applied</span>
                  </div>

                  <Link
                    to={`/jobseeker/job/${job._id}`}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    View Details →
                  </Link>
                </div>
              </article>
            ))}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 py-4">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="bg-white w-[80%] h-full p-5">
            <button onClick={() => setMobileFiltersOpen(false)}>
              <X />
            </button>

            <SidebarContent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              toggle={toggle}
              categories={categories}
              workModes={workModes}
              jobTypes={jobTypes}
              locations={locations}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= SIDEBAR ================= */

const SidebarContent = ({
  searchTerm,
  setSearchTerm,
  filters,
  toggle,
  categories,
  workModes,
  jobTypes,
  locations,
}) => (
  <>
    <h3 className="font-semibold text-lg mb-4">All Filters</h3>

    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search jobs"
      className="w-full mb-5 border rounded-lg px-3 py-2 text-sm"
    />

    <Filter
      title="Category"
      items={categories}
      active={filters.category}
      onToggle={(v) => toggle("category", v)}
    />

    <Filter
      title="Work Mode"
      items={workModes}
      active={filters.workMode}
      onToggle={(v) => toggle("workMode", v)}
    />

    <Filter
      title="Job Type"
      items={jobTypes}
      active={filters.employmentType}
      onToggle={(v) => toggle("employmentType", v)}
    />

    <Filter
      title="Location"
      items={locations}
      active={filters.location}
      onToggle={(v) => toggle("location", v)}
    />
  </>
);

/* ================= FILTER ================= */

const Filter = ({ title, items, active, onToggle }) => (
  <div className="mb-5">
    <h4 className="font-semibold text-sm mb-2">{title}</h4>
    <div className="space-y-2">
      {items.map((i) => (
        <label key={i} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={active.includes(i)}
            onChange={() => onToggle(i)}
          />
          {i}
        </label>
      ))}
    </div>
  </div>
);
