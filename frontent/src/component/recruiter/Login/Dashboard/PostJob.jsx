

import React, { useState, useRef, useContext } from "react";
import { Sidebar } from "./Sidebar";
import { SoftContext } from "../../../../../context/SoftContext";
import toast from "react-hot-toast";
import { API_URL } from "../../../../config/api";


export const PostJob = () => {
  const { token } = useContext(SoftContext);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    jobTitle: "",
    category: "",
    employmentType: "",
    workMode: "",
    location: "",
    salary: "",
    experience: "",
    openings: 1,
    deadline: "",
    responsibilities: "",
    requirements: "",
    skills: "",
    aboutRole: "",
    companyName: "",
    industry: "",
    website: "",
    companyOverview: "",
    hrName: "",
    hrEmail: "",
    hrPhone: "",
  });

  const fileRef = useRef(null);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "openings" ? Number(value) : value,
    }));
  };

  /* ---------------- HANDLE SUBMIT ---------------- */
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;

  if (!form.jobTitle || !form.companyName) {
    toast.error("Job Title and Company Name are required");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (fileRef.current?.files[0]) {
      formData.append("companyLogo", fileRef.current.files[0]);
    }

    const res = await fetch(
      `${API_URL}/api/recruiter/createjob`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to post job");
    }

    toast.success("Job Posted Successfully 🎉");

    setForm({
      jobTitle: "",
      category: "",
      employmentType: "",
      workMode: "",
      location: "",
      salary: "",
      experience: "",
      openings: 1,
      deadline: "",
      responsibilities: "",
      requirements: "",
      skills: "",
      aboutRole: "",
      companyName: "",
      industry: "",
      website: "",
      companyOverview: "",
      hrName: "",
      hrEmail: "",
      hrPhone: "",
    });

    if (fileRef.current) fileRef.current.value = "";

  } catch (error) {
    toast.error(error.message || "Something went wrong ❌");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Sidebar />

      <main className="flex-1 px-4 py-6">
        <div className="min-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-12">

            {/* -------- JOB DETAILS -------- */}
            <Section title="Job Details">
              <Grid>
                <InputField name="jobTitle" label="Job Title *" form={form} handleChange={handleChange} required />
                <InputField name="category" label="Category" form={form} handleChange={handleChange} />

                {/* NEW FIELD - Employment Type */}
                <SelectField
                  name="employmentType"
                  label="Employment Type"
                  form={form}
                  handleChange={handleChange}
                  options={[
                    "Full-Time",
                    "Part-Time",
                    "Internship",
                    "Contract",
                    "Temporary"
                  ]}
                />

                {/* NEW FIELD - Work Mode */}
                <SelectField
                  name="workMode"
                  label="Work Mode"
                  form={form}
                  handleChange={handleChange}
                  options={[
                    "On-Site",
                    "Remote",
                    "Hybrid"
                  ]}
                />

                <InputField name="location" label="Location" form={form} handleChange={handleChange} />
                <InputField name="salary" label="Salary" form={form} handleChange={handleChange} />
                <InputField name="experience" label="Experience" form={form} handleChange={handleChange} />
                <InputField name="openings" type="number" label="Openings" form={form} handleChange={handleChange} />
                <InputField name="deadline" type="date" label="Deadline" form={form} handleChange={handleChange} />
              </Grid>
            </Section>

            {/* -------- JOB DESCRIPTION -------- */}
            <Section title="Job Description">
              <TextareaField name="aboutRole" label="About Role" form={form} handleChange={handleChange} />
              <TextareaField name="responsibilities" label="Responsibilities (comma separated)" form={form} handleChange={handleChange} />
              <TextareaField name="requirements" label="Requirements (comma separated)" form={form} handleChange={handleChange} />
              <InputField name="skills" label="Skills" form={form} handleChange={handleChange} />
            </Section>

            {/* -------- COMPANY INFO -------- */}
            <Section title="Company Info">
              <Grid>
                <InputField name="companyName" label="Company Name *" form={form} handleChange={handleChange} required />
                <InputField name="industry" label="Industry" form={form} handleChange={handleChange} />
                <InputField name="website" label="Website" form={form} handleChange={handleChange} />
                <InputField name="hrName" label="HR Name" form={form} handleChange={handleChange} />
                <InputField name="hrEmail" label="HR Email" form={form} handleChange={handleChange} />
                <InputField name="hrPhone" label="HR Phone" form={form} handleChange={handleChange} />
              </Grid>

              <TextareaField name="companyOverview" label="Company Overview" form={form} handleChange={handleChange} />

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="mt-4 p-2 border rounded-lg"
              />
            </Section>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-xl font-medium transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                }`}
              >
                {loading ? "Posting..." : "Post Job"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

/* ---------- UI Components ---------- */

const Section = ({ title, children }) => (
  <section className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
    <h2 className="text-xl font-semibold text-indigo-600 mb-6">
      {title}
    </h2>
    {children}
  </section>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {children}
  </div>
);

const InputField = ({ name, type = "text", form, handleChange, label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input
      name={name}
      type={type}
      value={form[name]}
      onChange={handleChange}
      className="p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      {...props}
    />
  </div>
);

const SelectField = ({ name, form, handleChange, label, options }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <select
      name={name}
      value={form[name]}
      onChange={handleChange}
      className="p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    >
      <option value="">Select {label}</option>
      {options.map((opt, index) => (
        <option key={index} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const TextareaField = ({ name, form, handleChange, label }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <textarea
      name={name}
      value={form[name]}
      onChange={handleChange}
      rows={4}
      className="p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    />
  </div>
);
