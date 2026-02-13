
import React, { useContext, useState } from "react";
import { SoftContext } from "../../../context/SoftContext";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../config/api";

export const AuthForm = () => {
  const { setToken, setRole } = useContext(SoftContext);
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const url = `${API_URL}/api/auth/${mode}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setToken(data.token);
      setRole(data.user.role);

      toast.success(
        mode === "login" ? "Welcome back!" : "Account created successfully"
      );

      if (mode === "register") setMode("login");

      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            {mode === "login" ? "Welcome Back 👋" : "Create Your Account"}
          </h2>

          <div className="space-y-4">
            {mode === "register" && (
              <>
                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Role</option>
                  <option value="jobseeker">Jobseeker</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </>
            )}

            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />

            {mode !== "forgot" && (
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input"
              />
            )}
          </div>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className={`w-full py-2 mt-5 rounded-lg text-white font-medium transition-all ${
              loading ? "bg-gray-400" : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>

          {/* OR divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social buttons */}
          <div className="space-y-3">
            <button
              onClick={() =>
                (window.location.href = `${API_URL}/api/auth/google`)
              }
              className="social-btn flex items-center justify-center gap-2 border p-2 rounded-lg w-full hover:bg-gray-100 transition"
            >
              <FcGoogle size={22} /> Continue with Google
            </button>

            <button
              className="social-btn flex items-center justify-center gap-2 border p-2 rounded-lg w-full hover:bg-blue-50 transition text-blue-700"
            >
              <FaLinkedinIn size={22} /> Continue with LinkedIn
            </button>
          </div>

          {/* Toggle mode */}
          <p className="text-center mt-5 text-sm text-gray-500">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
