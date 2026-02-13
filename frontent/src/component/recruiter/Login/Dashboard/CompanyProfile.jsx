
import React, { useContext, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { SoftContext } from "../../../../../context/SoftContext";
import { API_URL } from "../../../../config/api";

export const CompanyProfile = () => {
  const { token } = useContext(SoftContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    companyName: "",
    industry: "",
    website: "",
    companySize: "",
    location: "",
    aboutCompany: "",
  });

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔹 Fetch recruiter profile
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/recruiter/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setForm({
          name: data.recruiter.name || "",
          phone: data.recruiter.phone || "",
          companyName: data.recruiter.companyName || "",
          industry: data.recruiter.industry || "",
          website: data.recruiter.website || "",
          companySize: data.recruiter.companySize || "",
          location: data.recruiter.location || "",
          aboutCompany: data.recruiter.aboutCompany || "",
        });

        setPreview(data.recruiter.companyLogo || null);
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  // 🔹 Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Logo change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (logo) {
        formData.append("companyLogo", logo);
      }

      const res = await fetch(`${API_URL}/api/recruiter/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("data is=",data)

      if (data.success) {
        // ✅ Update UI with latest data (NO empty form)
        setForm({
          name: data.recruiter.name || "",
          phone: data.recruiter.phone || "",
          companyName: data.recruiter.companyName || "",
          industry: data.recruiter.industry || "",
          website: data.recruiter.website || "",
          companySize: data.recruiter.companySize || "",
          location: data.recruiter.location || "",
          aboutCompany: data.recruiter.aboutCompany || "",
        });

        setPreview(data.recruiter.companyLogo || null);
        setLogo(null);

        alert("Profile updated successfully ✅");
      } else {
        alert("Profile update failed ❌");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Company Profile</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow space-y-6"
        >
          {/* Logo */}
          <div className="flex items-center gap-6">
            {preview && (
              <img
                src={preview}
                alt="Company Logo"
                className="w-24 h-24 rounded-xl object-cover border"
              />
            )}
            <input type="file" accept="image/*" onChange={handleLogoChange} />
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" />
            <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />

            <input className="input" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name" />
            <input className="input" name="industry" value={form.industry} onChange={handleChange} placeholder="Industry" />

            <input className="input" name="website" value={form.website} onChange={handleChange} placeholder="Website" />
            <input className="input" name="companySize" value={form.companySize} onChange={handleChange} placeholder="Company Size" />

            <input className="input" name="location" value={form.location} onChange={handleChange} placeholder="Location" />
          </div>

          {/* About */}
          <textarea
            className="input w-full h-28"
            name="aboutCompany"
            value={form.aboutCompany}
            onChange={handleChange}
            placeholder="About Company"
          />

          {/* Submit */}
          <button
            onClick={()=>handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>
    </div>
  );
};

