
import React, { useContext, useState } from "react";
import { SoftContext } from "../../context/SoftContext";
import { API_URL } from "../../../config/api";


export const AuthForm = () => {
  const [mode, setMode] = useState("login");

  const {setToken,setRole}=useContext(SoftContext);

  const [formData,setFormData]=useState({
    name:"",
    email:"",
    password:"",
    role:""
  })

  const handelchange=(e)=>{
    setFormData({
      ...formData,[e.target.name]:e.target.value,
    });
  };

  const handelsubmit = async (e) => {
      e.preventDefault();

      try {
        let url = "";
        let bodyData = {};

        if (mode === "login") {
          url = `${API_URL}/api/auth/login`;
          bodyData = {
            email: formData.email,
            password: formData.password,
          };
        }

        if (mode === "register") {
          url = `${API_URL}/api/auth/register`;
          bodyData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          };
        }

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify(bodyData),
        });

        const data = await res.json();
        console.log("Response:", data);
        setToken(data.token);
        setRole(data.role);

        if (!res.ok) {
          return alert(data.message || "Something went wrong");
        }

        // SUCCESS HANDLING
        if (mode === "login") {
          alert("Login Successful");
        }

        if (mode === "register") {
          alert("Registered Successfully");
          setMode("login");
        }

      } catch (error) {
        console.log("Error:", error);
        alert("Something went wrong");
      }
    };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div
        className="w-96 bg-white p-8 rounded-2xl shadow-xl border border-gray-300
          transform transition-all duration-500 ease-out 
          animate-[fadeIn_0.8s_ease-out]"
      >
        
        {/* -------- Title -------- */}
        <h2
          className="text-center text-2xl font-semibold mb-6 text-gray-800
          animate-[slideDown_0.6s_ease-out]"
        >
          {mode === "login" && "Welcome Back 👋"}
          {mode === "register" && "Create Your Account"}
          {mode === "forgot" && "Reset Password"}
        </h2>

        {/* ------------ INPUT FIELDS ------------- */}
        <div className="space-y-4">

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full border border-gray-300 p-2.5 rounded-lg 
              focus:ring-2 focus:ring-black/70 transition-all outline-none
              bg-gray-50"
            value={formData.email}
            onChange={handelchange}
          />

          {/* Password */}
          {mode !== "forgot" && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-2.5 rounded-lg 
                focus:ring-2 focus:ring-black/70 transition-all outline-none
                bg-gray-50"
              value={formData.password}
              onChange={handelchange}
            />
          )}

          {/* Full Name only for Register */}
          {mode === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border border-gray-300 p-2.5 rounded-lg 
                focus:ring-2 focus:ring-black/70 transition-all outline-none
                bg-gray-50"
              value={formData.name}
              onChange={handelchange}
            />
          )}

          {/* ---- ROLE FIELD ONLY FOR REGISTER ---- */}
          {mode === "register" && (
            <select
              name="role"
              className="w-full border border-gray-300 p-2.5 rounded-lg bg-gray-50
                focus:ring-2 focus:ring-black/70 transition-all outline-none"
              value={formData.role}
              onChange={handelchange}
            >
              <option value="">Select Role</option>
              <option value="applicant">Applicant</option>
              <option value="recruiter">Recruiter</option>
            </select>
          )}
        </div>

        {/* -------- Middle Buttons (Toggle) -------- */}
        <div className="flex justify-between mt-5 text-sm">

          {/* Left Button */}
          {mode === "login" && (
            <button
              onClick={() => setMode("forgot")}
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          )}

          {(mode === "register" || mode === "forgot") && (
            <button
              onClick={() => setMode("login")}
              className="text-blue-600 hover:underline"
            >
              Back to Login
            </button>
          )}

          {/* Right Button */}
          {mode === "login" && (
            <button
              onClick={() => setMode("register")}
              className="text-blue-600 hover:underline"
            >
              Register
            </button>
          )}

          {mode === "register" && (
            <button
              onClick={() => setMode("login")}
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
          )}

          {mode === "forgot" && (
            <button
              onClick={() => setMode("register")}
              className="text-blue-600 hover:underline"
            >
              Create Account
            </button>
          )}
        </div>

        {/* -------- Submit Button -------- */}
        <button
          className="w-full bg-black text-white py-2.5 rounded-lg mt-6 
            hover:bg-gray-900 transition-all font-medium
            animate-[fadeIn_1s_ease-out]"
          onClick={handelsubmit}
        >
          {mode === "login" && "Login"}
          {mode === "register" && "Register"}
          {mode === "forgot" && "Send Reset Link"}
        </button>

      </div>
    </div>
  );
};
