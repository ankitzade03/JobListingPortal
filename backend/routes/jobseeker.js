import express from "express";
import { auth, isJobSeeker,protect } from "../middelware/authMiddelware.js";
import { applyJob, deleteApplication, getAllApplications, getAllJobs, getAllJobsForJobseeker, getJobDetails, updateJobseekerProfile,} from "../controller/jobseeker.js";
import upload from "../middelware/upload.js";

const router = express.Router();

router.get("/job/:jobId", protect, isJobSeeker, getJobDetails);

router.post(
  "/apply/:jobId",
  auth,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "applicantPhoto", maxCount: 1 }
  ]),
  applyJob
);


router.get("/jobs", auth, getAllJobsForJobseeker);

router.get("/my-applications", auth, getAllApplications);

// router.put("/update-profile", auth,isJobSeeker, updateJobseekerBasicProfile);

router.put(
  "/updateprofile-basic",
  auth,
  upload.single("profilePicture"),
  updateJobseekerProfile
);

router.get("/jobs/search", getAllJobs);


router.delete(
  "/application/:id",
  auth,        // verifies token
  deleteApplication
);




export default router;
