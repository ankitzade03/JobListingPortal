import express from "express";
import { getAllJobs,getApplicantsByJob, getApplicationsCountByJobTitle, getRecruiterJobs, postJobController } from "../controller/postJobController.js";
import { auth, isRecruiter, protect } from "../middelware/authMiddelware.js";
import upload from "../middelware/upload.js";
import { deleteApplication, getAnalysisData, getApplicantDetails, getDashboardData, getRecruiterApplications, getRecruiterJobsWithApplications, scheduleInterview,  updateApplicationStatus, updateRecruiterProfile } from "../controller/recruiter.js";
import { sendInterviewEmail } from "../controller/mailservers/mailServers.js";


// getAllJobs,

const router = express.Router();

// ✅ UPDATE RECRUITER PROFILE
router.put(
  "/profile",
  auth,
  upload.single("companyLogo"),
  updateRecruiterProfile
);

// ➤ Get all applications for recruiter
router.post("/createjob", protect, isRecruiter, upload.single("companyLogo"), postJobController);

router.get("/all", protect, getAllJobs);

router.get("/getjob_posted_by_recruiter", protect, isRecruiter, getRecruiterJobs);

// router.put("/status/:id", auth, updateApplicationStatus);

router.put("/application/status/:applicationId", auth, updateApplicationStatus);

// Only admin or recruiter should access dashboard
router.get("/dashboard", auth, getDashboardData);

router.get("/analysis", auth, getAnalysisData);

// router.get("/job/:jobId/applications",auth,getJobApplications);

// router.get("/applications", auth, getAllApplications);

router.get("/applications", auth, getRecruiterApplications);

router.get(
    "/application/:applicantId",
    auth,
    getApplicantDetails
);

router.put(
  "/update-status/:id",
  auth,
  updateApplicationStatus
);

router.get(
  "/jobs/applications",
  auth,
  getRecruiterJobsWithApplications
);



router.get(
  "/applications/count-by-job",
  auth,
  getApplicationsCountByJobTitle
);

// Get all applicants for a job
router.get(
  "/job/:jobId/applications",
  auth,
  getApplicantsByJob
);


router.delete(
  "/application/:id",
  auth,
  deleteApplication
);


router.post("/schedule-interview/:id", auth, scheduleInterview);


export default router;



