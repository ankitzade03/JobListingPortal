
import cloudinary from "../config/cloudinary.js";
import Application from "../module/Application.js";
import Job from "../module/Job.js";
import crypto from "crypto";

// import Application from "../module/Application";

// export const postJobController = async (req, res) => {
//   console.log("USER FROM TOKEN =>", req.user);
//   console.log("BODY RECEIVED =>", req.body);

//   try {
//     const {
//       jobTitle,
//       category,
//       employmentType,
//       workMode,
//       location,
//       salary,
//       experience,
//       openings,
//       deadline,
//       responsibilities,
//       requirements,
//       skills,
//       aboutRole,
//       companyName,
//       industry,
//       website,
//       companyOverview,
//       hrName,
//       hrEmail,
//       hrPhone,
//     } = req.body;

//     // ✅ Convert comma-separated values to arrays
//     const formattedResponsibilities = responsibilities
//       ? responsibilities.split(",").map(item => item.trim())
//       : [];

//     const formattedRequirements = requirements
//       ? requirements.split(",").map(item => item.trim())
//       : [];

//     const formattedSkills = skills
//       ? skills.split(",").map(item => item.trim())
//       : [];

//     // ✅ Upload company logo if provided
//     let companyLogoUrl = "";
//     if (req.file) {
//       const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//         folder: "job_portal/company_logos",
//       });
//       companyLogoUrl = uploadResult.secure_url;
//     }

//     // ✅ Create Job
//     const job = await Job.create({
//       recruiter: req.user._id, // 🔥 important

//       jobTitle,
//       category,
//       employmentType,
//       workMode,
//       location,
//       salary,
//       experience,
//       openings,
//       deadline,

//       responsibilities: formattedResponsibilities,
//       requirements: formattedRequirements,
//       skills: formattedSkills,

//       aboutRole,
//       companyName,
//       industry,
//       website,
//       companyOverview,

//       hrName,
//       hrEmail,
//       hrPhone,

//       companyLogo: companyLogoUrl,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Job posted successfully",
//       job,
//     });

//   } catch (error) {
//     console.error("Post Job Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



// JobSeeker: Get all available jobs
// ---------------------------
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: jobs.length, jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Recruiter: Get all jobs posted by recruiter
// ---------------------------
export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: jobs.length, jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getApplicationsCountByJobTitle = async (req, res) => {
  try {
    const data = await Application.aggregate([
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },

      {
        $group: {
          _id: "$job.jobTitle",
          totalApplications: { $sum: 1 },
          jobId: { $first: "$job._id" },
          location: { $first: "$job.location" },
        },
      },

      {
        $project: {
          _id: 0,
          jobTitle: "$_id",
          jobId: 1,
          location: 1,
          totalApplications: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      totalJobs: data.length,
      jobs: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch application count",
      error: error.message,
    });
  }
};


export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Fetch applications
    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email phone profilePicture")
      .populate("job", "jobTitle location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobTitle: job.jobTitle,
      totalApplications: applications.length,
      applications,
    });

  } catch (error) {
    console.error("Get Applicants Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching applicants",
      error: error.message,
    });
  }
};


export const postJobController = async (req, res) => {
  console.log("USER FROM TOKEN =>", req.user);
  console.log("BODY RECEIVED =>", req.body);

  try {
    const {
      jobTitle,
      category,
      employmentType,
      workMode,
      location,
      salary,
      experience,
      openings,
      deadline,
      responsibilities,
      requirements,
      skills,
      aboutRole,
      companyName,
      industry,
      website,
      companyOverview,
      hrName,
      hrEmail,
      hrPhone,
    } = req.body;

    // ✅ Check required fields
    if (!jobTitle || !companyName || !location) {
      return res.status(400).json({
        success: false,
        message: "Job Title, Company Name and Location are required",
      });
    }

    // ✅ PREVENT DUPLICATE JOB
    const existingJob = await Job.findOne({
      recruiter: req.user._id,
      jobTitle: jobTitle.trim(),
      companyName: companyName.trim(),
      location: location.trim(),
      status: "Open",
    });

    if (existingJob) {
      return res.status(400).json({
        success: false,
        message: "This job is already posted and active.",
      });
    }

    // ✅ Convert comma-separated values to arrays
    const formattedResponsibilities = responsibilities
      ? responsibilities.split(",").map(item => item.trim())
      : [];

    const formattedRequirements = requirements
      ? requirements.split(",").map(item => item.trim())
      : [];

    const formattedSkills = skills
      ? skills.split(",").map(item => item.trim())
      : [];

    // ✅ Upload logo if provided
    let companyLogoUrl = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "job_portal/company_logos",
      });
      companyLogoUrl = uploadResult.secure_url;
    }

    // ✅ Create Job
    const job = await Job.create({
      recruiter: req.user._id,

      jobTitle: jobTitle.trim(),
      category,
      employmentType,
      workMode,
      location: location.trim(),
      salary,
      experience,
      openings,
      deadline,

      responsibilities: formattedResponsibilities,
      requirements: formattedRequirements,
      skills: formattedSkills,

      aboutRole,
      companyName: companyName.trim(),
      industry,
      website,
      companyOverview,

      hrName,
      hrEmail,
      hrPhone,

      companyLogo: companyLogoUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });

  } catch (error) {
    console.error("Post Job Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
