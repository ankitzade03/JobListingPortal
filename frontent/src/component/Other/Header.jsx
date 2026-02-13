import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SoftContext } from "../../../context/SoftContext";
import { FaUser } from "react-icons/fa";
export const HeaderJobseeker = () => {
  const { token, setToken, setRole } = useContext(SoftContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md relative">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
        SearchDreamJob
      </h1>

      <nav className="hidden md:flex gap-6">
        <NavLink
          to="/jobseeker"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/jobseeker/jobs"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
          }
        >
          Jobs
        </NavLink>
        <NavLink
          to="/jobseeker/my-applications"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
          }
        >
          My Applications
        </NavLink>

        <NavLink
          to="/jobseeker/aboutsupport"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
          }
        >
          About
        </NavLink>

        <NavLink
          to="/jobseeker/contactsupport"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
          }
        >
          Contact
        </NavLink>
      </nav>

      {/* Right Icons */}
      <div className="flex items-center gap-5">
        {token && (
          <>
            <div className="hidden md:flex w-10 h-10 rounded-full bg-gray-200 items-center justify-center cursor-pointer border">
              <FaUser className="text-gray-600 text-lg" />
            </div>
          </>
        )}

        {token ? (
          <button
            onClick={handleLogout}
            className="hidden md:block px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="hidden md:block px-4 py-2 border border-blue-600 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Login / Register
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md p-5 space-y-4 z-50">
          <NavLink to="/jobseeker" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/jobseeker/jobs" onClick={() => setMenuOpen(false)}>
            Jobs
          </NavLink>
          <NavLink
            to="/jobseeker/aboutsupport"
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/jobseeker/contactsupport"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>

          {token ? (
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-500 text-white rounded-md"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
              className="w-full py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white"
            >
              Login / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
};

const PublicHeader = () => {
  const { token } = useContext(SoftContext);
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-blue-600 cursor-pointer"
      >
        SearchDreamJob
      </h1>

      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
          }
        >
          Home
        </NavLink>

        <NavLink
          to={token ? "/jobseeker/jobs" : "/login"}
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
          }
          onClick={(e) => {
            if (!token) {
              e.preventDefault();
              navigate("/login"); // redirect to login if not logged in
            }
          }}
        >
          Jobs
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
          }
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
          }
        >
          Contact
        </NavLink>
      </nav>

      {/* Login / Register Button */}
      {!token && (
        <button
          onClick={() => navigate("/login")}
          className="hidden md:block px-4 py-2 border border-blue-600 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white"
        >
          Login / Register
        </button>
      )}

      <div className="md:hidden text-2xl cursor-pointer">☰</div>
    </header>
  );
};

export default PublicHeader;
