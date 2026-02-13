
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";

export const Support = () => {
  const [form, setForm] = useState({
    category: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Support ticket submitted. Admin will review it soon ✅");

    setForm({
      category: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Support</h1>

          {/* INFO MESSAGE */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
            <p className="text-sm text-blue-700">
              🛠️ All support requests are handled by the Admin panel.
              <br />
              Please submit your issue and our admin team will respond within
              <strong> 24–48 hours</strong>.
            </p>
          </div>

          {/* SUPPORT FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow space-y-4"
          >
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Select Issue Type</option>
              <option value="account">Account Issue</option>
              <option value="profile">Profile Update Issue</option>
              <option value="job">Job Posting Issue</option>
              <option value="application">Application Issue</option>
              <option value="other">Other</option>
            </select>

            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="input w-full"
              required
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your issue in detail"
              className="input w-full h-32"
              required
            />

            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Submit Ticket
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
