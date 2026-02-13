

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { PostJob } from "./Dashboard/PostJob";
import { ManageJobs } from "./Dashboard/ManageJobs";
import { Applications } from "./Dashboard/Applications";
import { CompanyProfile } from "./Dashboard/CompanyProfile";
import { ProfileSettings } from "./Dashboard/ProfileSettings";
import { AnalysisDashboard} from "./Dashboard/Analytics";
import { Support } from "./Dashboard/Support";
import { AdminDashboard } from "./Dashboard/Dashboard";
import { ApplicantFile } from "./Dashboard/ApplicantFile";
import { ApplicationsUsers } from "./Dashboard/Applicationsusers";


export const Recruiter = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard/>} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="manage-jobs" element={<ManageJobs />} />
        <Route path="applications" element={<Applications />} />
        <Route path="company-profile" element={<CompanyProfile />} />
        <Route path="settings" element={<ProfileSettings />} />
        <Route path="analytics" element={<AnalysisDashboard />} />
        <Route path="support" element={<Support />} />
        <Route path="application/:id" element={<ApplicantFile />} />
        <Route path="job/:jobId/applications" element={<ApplicationsUsers/>} />
      </Routes>
    </div>
  );
};
