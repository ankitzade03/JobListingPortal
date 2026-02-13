import React, { useContext, useState } from "react";
import { SoftContext } from "../../../context/SoftContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
export const InitalLandingPage = () => {
  const navigate = useNavigate();
  const { token, setToken, setRole } = useContext(SoftContext);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    const params = new URLSearchParams();

    if (title) params.append("title", title);
    if (location) params.append("location", location);
    if (category) params.append("category", category);

    navigate(`/jobseeker/jobs?${params.toString()}`);
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    navigate("/login");
  };

  return (
    <div className="w-full text-gray-900">
      <section className="relative w-full py-28 px-6 overflow-hidden text-gray-900">
        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c')",
          }}
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/40 to-black/50" />

        {/* BLUR DECORATIONS */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-400/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-rose-400/40 rounded-full blur-3xl" />

        {/* CONTENT */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-white"
          >
            Find Your <span className="text-pink-400">Dream Job</span> <br />
            <span className="text-blue-200">in Minutes</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto text-center leading-relaxed"
          >
            Search thousands of{" "}
            <span className="text-pink-300 font-semibold">
              verified job opportunities
            </span>{" "}
            and start your career journey with confidence.
          </motion.p>

          {/* FEATURE BADGES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center flex-wrap gap-4 mt-10"
          >
            <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold shadow">
              ✔ Verified Jobs
            </span>
            <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold shadow">
              ⚡ Quick Apply
            </span>
            <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold shadow">
              🔒 Trusted Companies
            </span>
          </motion.div>
        </div>

        {/* SEARCH BOX */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="relative z-10 mt-14 backdrop-blur-2xl bg-white/60 border border-white/30 shadow-2xl rounded-2xl p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-4"
        >
          <select
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          >
            <option value="">Select Job Title</option>
            <option>Software Development</option>
            <option>Backend Developer</option>
            <option>Data Analytics</option>
            <option>Information Technology</option>
            <option>Specilist Software Development</option>
          </select>

          <select
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select Location</option>
            <option>Mumbai</option>
            <option>Pune</option>
            <option>Chennai</option>
            <option>Hyderabad</option>
            <option>Delhi</option>
            <option>Nagpur</option>
          </select>

          <select
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option>IT & Software</option>
            <option>Business & Management</option>
            <option>Design</option>
            <option>Finance</option>
            <option>Internships</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-all"
          >
            Search
          </button>
        </motion.div>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="relative z-10 mt-8 flex justify-center gap-6"
        >
          <button
            onClick={handleSearch}
            className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold border border-pink-400 hover:bg-pink-50 transition"
          >
            Search Jobs
          </button>

          <button
            onClick={() => navigate("/login")}
            className="bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
          >
            Create Account
          </button>
        </motion.div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-blue-700 tracking-wide">
          Popular Job Categories
        </h2>

        <p className="text-center text-gray-600 mb-12 text-lg">
          Explore categories that fit your talent and career path.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { name: "IT & Software Development", icon: "💻" },
            { name: "Marketing & Sales", icon: "📈" },
            { name: "Engineering", icon: "⚙️" },
            { name: "Finance & Accounting", icon: "💰" },
            { name: "Human Resources", icon: "🧑‍💼" },
            { name: "Internships", icon: "🎓" },
            { name: "Data Science", icon: "📊" },
            { name: "Design & Creative", icon: "🎨" },
          ].map((cat) => (
            <div
              key={cat.name}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-100
                   hover:-translate-y-2 transition-all duration-300 cursor-pointer group
                   flex flex-col items-center justify-center text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-pink-50 to-white font-[Poppins]">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-blue-700 tracking-wide uppercase">
          Latest & Featured Jobs
        </h2>

        <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
          Explore top job opportunities from verified and trusted companies.
          Apply confidently to roles that match your skills and career goals.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "Frontend Developer",
              company: "XYZ Pvt Ltd",
              location: "Remote",
              icon: "💻",
            },
            {
              title: "Marketing Executive",
              company: "ABC Technologies",
              location: "Pune",
              icon: "📢",
            },
            {
              title: "Data Analyst",
              company: "DataCore",
              location: "Bengaluru",
              icon: "📊",
            },
          ].map((job) => (
            <div
              key={job.title}
              className="bg-white p-10 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-3
                   transition-all duration-300 border border-gray-100
                   flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-4">{job.icon}</div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-wide">
                {job.title}
              </h3>

              <p className="text-gray-500 font-medium">🏢 {job.company}</p>
              <p className="text-gray-500 font-medium mb-4">
                📍 {job.location}
              </p>

              <div className="flex gap-2 flex-wrap justify-center mb-6">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Full Time
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Urgent
                </span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  Skill Match
                </span>
              </div>

              <button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                           px-5 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-purple-50 to-white">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-purple-700 tracking-wide">
          How Our Job Portal Works
        </h2>

        <p className="text-center text-gray-600 mb-14 text-lg">
          Follow these simple steps to land your dream job quickly and easily.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "Create Your Account",
              text: "Build your profile using your basic details, skills, and experience.",
              icon: "🧑‍💼",
            },
            {
              title: "Search for Jobs",
              text: "Use filters like role, location, salary, company, and category.",
              icon: "🔍",
            },
            {
              title: "Apply & Get Hired",
              text: "Submit applications directly to verified employers.",
              icon: "📩",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md
                   hover:shadow-xl hover:-translate-y-2 transition-all duration-300
                   text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-[Poppins]">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-relaxed font-[Inter]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-8 bg-linear-to-b from-purple-50 to-white font-[Poppins]">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-purple-700 tracking-wide uppercase">
          About JobPortal
        </h2>

        <p className="max-w-3xl mx-auto text-center text-gray-700 text-lg leading-relaxed">
          JobPortal is created to simplify the job search experience for both
          job seekers and employers. Every job listing is verified, ensuring
          real opportunities and a safe, transparent hiring environment. Our
          platform connects talent with the right opportunities quickly and
          effectively.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto mt-16">
          <div
            className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all
                    border border-gray-100 text-center"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-purple-700 mb-2">
              Verified Job Listings
            </h3>
            <p className="text-gray-600">
              Only real and trusted job postings to ensure a secure job search
              experience.
            </p>
          </div>

          <div
            className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all
                    border border-gray-100 text-center"
          >
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-purple-700 mb-2">
              Fast & Easy Apply
            </h3>
            <p className="text-gray-600">
              Apply to multiple jobs in just one click using your JobPortal
              profile.
            </p>
          </div>

          <div
            className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all
                    border border-gray-100 text-center"
          >
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-purple-700 mb-2">
              Connect with Employers
            </h3>
            <p className="text-gray-600">
              Engage with verified employers and get hired faster with the right
              match.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white font-[Poppins]">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-blue-700 tracking-wide">
          Why Job Seekers Love Us
        </h2>

        <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto text-lg">
          We provide tools that help you find the right job quickly and easily.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { text: "Easy-to-use interface", icon: "⚡" },
            { text: "Verified job listings", icon: "🔒" },
            { text: "Instant job alerts", icon: "📩" },
            { text: "One-click apply system", icon: "🖱️" },
            { text: "Track application status", icon: "📊" },
            { text: "Personalized job recommendations", icon: "🎯" },
          ].map((feature) => (
            <div
              key={feature.text}
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-100
                   hover:shadow-xl hover:-translate-y-2 transition-all duration-300
                   text-center flex flex-col items-center gap-3"
            >
              <div
                className="text-4xl bg-blue-100 text-blue-600 w-16 h-16 rounded-full
                        flex items-center justify-center shadow-sm"
              >
                {feature.icon}
              </div>

              <p className="text-lg font-semibold text-gray-700">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-gray-100 to-white font-[Poppins]">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-indigo-700 uppercase tracking-wide">
          Why Employers Choose Us
        </h2>

        <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto text-lg">
          Powerful tools and features designed to help employers hire the best
          talent with ease and speed.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            { text: "Post unlimited job openings", icon: "📢" },
            { text: "Reach thousands of job seekers", icon: "🌍" },
            { text: "Smart applicant filtering", icon: "🔍" },
            { text: "Company dashboard", icon: "📊" },
            { text: "Schedule interviews", icon: "⏰" },
            { text: "Verified job seeker profiles", icon: "✔️" },
          ].map((item) => (
            <div
              key={item.text}
              className="bg-white flex items-center gap-4 p-5 rounded-xl shadow-sm hover:shadow-lg
                   border border-gray-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-3xl bg-indigo-100 text-indigo-700 p-3 rounded-full">
                {item.icon}
              </div>

              <p className="text-gray-800 text-lg font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-white to-blue-50 font-[Poppins]">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-700 tracking-wide uppercase">
          What Our Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              text: "This platform helped me land my first job within a week. Super fast and reliable!",
              name: "Aman Sharma",
              role: "Frontend Developer",
              img: "https://i.pravatar.cc/150?img=32",
            },
            {
              text: "User-friendly interface, real companies, and quick job alerts. Highly recommended!",
              name: "Priya Patel",
              role: "Marketing Executive",
              // img: "https://i.pravatar.cc/150?img=12",
            },
            {
              text: "As an employer, hiring has become smoother than ever. Great dashboard and filters!",
              name: "Rahul Verma",
              role: "HR Manager",
              // img: "https://i.pravatar.cc/150?img=65",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-2xl border border-gray-200 shadow-md
                   hover:shadow-2xl hover:-translate-y-3 hover:border-blue-200
                   transition-all duration-500 text-center"
            >
              <img
                // src={item.img}
                alt="user"
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-100 shadow"
              />

              <div className="flex justify-center mb-4 text-yellow-400 text-2xl tracking-wider">
                ★★★★★
              </div>

              <p className="text-gray-700 italic mb-6 leading-relaxed">
                “{item.text}”
              </p>

              <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>

              <p className="text-gray-500 text-sm">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center font-[Poppins]">
        <h2 className="text-4xl font-extrabold mb-4 tracking-wide">
          Start Your Career Journey Today
        </h2>

        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of successful candidates who found their dream jobs
          through our platform. Your future begins with a single click.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-white text-blue-700 px-10 py-4 rounded-xl font-semibold text-lg shadow-lg
               hover:bg-gray-100 transition-all hover:scale-105 duration-300"
        >
          Create Your Account Now
        </button>

        <p className="mt-6 opacity-80 text-sm">
          No fees • Quick registration • Verified companies
        </p>
      </section>

      <footer className="bg-gray-900 text-white py-14 px-8 font-[Poppins]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <h2 className="font-extrabold text-2xl text-white tracking-wide mb-3">
              JobPortal
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted platform to find verified jobs and hire skilled
              professionals efficiently.
            </p>

            <div className="flex gap-4 mt-5 text-xl">
              <i className="bi bi-facebook hover:text-blue-500 transition"></i>
              <i className="bi bi-instagram hover:text-pink-500 transition"></i>
              <i className="bi bi-linkedin hover:text-blue-400 transition"></i>
              <i className="bi bi-twitter hover:text-blue-300 transition"></i>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition cursor-pointer">
                About Us
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Careers
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Contact
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Job Seekers</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition cursor-pointer">
                Browse Jobs
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Categories
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Build Resume
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Employers</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition cursor-pointer">
                Post a Job
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Employer Login
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Pricing
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} JobPortal — All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
