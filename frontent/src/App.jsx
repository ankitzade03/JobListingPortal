

import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { SoftContext } from "../context/SoftContext";
import { AuthForm } from "./component/Login/Login";
import { ProtectedRoute } from "./component/ProtectedRoute";
import { Applicant } from "./component/Jobseeker/Applicant";
import { Recruiter } from "./component/recruiter/Login/Recruiter";
import PublicHeader, { HeaderJobseeker } from "./component/Other/Header";
import { RecruiterHeader } from "./component/recruiter/Login/Dashboard/RecruiterHeader";
import { ContactPage } from "./component/pages/Contact";
import { Aboutpage } from "./component/pages/About";
import { InitalLandingPage } from "./component/pages/InitalLandingPage";

import { Toaster } from "react-hot-toast";

export function App() {
  const { token, role } = useContext(SoftContext);

  const redirectToDashboard = () => {
    if (role === "jobseeker") return "/jobseeker";
    if (role === "recruiter") return "/recruiter";
    return "/";
  };

  return (
    <>
     <Toaster position="top-right" reverseOrder={false} />
      {/* Header based on login and role */}
      {!token ? (
        <PublicHeader />
      ) : role === "jobseeker" ? (
        <HeaderJobseeker />
      ) : role === "recruiter" ? (
        <RecruiterHeader />
      ) : (
        <PublicHeader />
      )}

      <Routes>
        <Route path="/" element={<InitalLandingPage />} />

        {/* Redirect logged-in users to their dashboard */}
        <Route
          path="/login"
          element={token ? <Navigate to={redirectToDashboard()} replace /> : <AuthForm />}
        />

        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<Aboutpage />} />

        <Route
          path="/jobseeker/*"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <Applicant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/*"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Recruiter />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
