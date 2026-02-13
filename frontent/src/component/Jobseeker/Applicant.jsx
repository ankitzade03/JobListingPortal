import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "../Other/Header";
import { JobList } from "../pages/Jobs";

import { AuthForm } from "../Login/Login";
import { LandingPage } from "../pages/Langingpages";
import { ContactPage } from "../pages/Contact";
import { Aboutpage } from "../pages/About";
import { SoftContext } from "../../../context/SoftContext";
import { JobIdDetials } from "./JobIdDetials";
import { RegistrationWizard } from "./RegistrationWizard";
import MyApplications from "./MyApplication";
// import { Jobsearchpage } from "../pages/Jobsearchpage";

export const Applicant = () => {
  const { token } = useContext(SoftContext);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/jobs"
          element={token ? <JobList /> : <Navigate to="/login" replace />}
        />
        <Route path="/my-applications" element={<MyApplications/>} />

        <Route path="/contactsupport" element={<ContactPage />} />
        <Route path="/aboutsupport" element={<Aboutpage />} />

        <Route path="/job/:id" element={<JobIdDetials />} />

        <Route path="/apply/:jobId" element={<RegistrationWizard />} />


      </Routes>
    </div>
  );
};
