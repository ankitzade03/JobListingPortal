
import cloudinary from "../config/cloudinary.js";
import Application from "../module/Application.js";
import Job from "../module/Job.js";
import User from "../module/User.js";
import crypto from "crypto";
import { sendInterviewEmail } from "./mailservers/mailServers.js";

export const updateRecruiterProfile = async (req, res) => {
  try {
    // 🔒 Only recruiter
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const recruiterId = req.user.id;

    const {
      name,
      phone,
      companyName,
      industry,
      website,
      companySize,
      location,
      aboutCompany,
      hrName,
      hrEmail,
      hrPhone,
    } = req.body;

    // ✅ IMPORTANT: Cloudinary gives URL in req.file.path
    const companyLogo = req.file ? req.file.path : undefined;

    const updatedRecruiter = await User.findByIdAndUpdate(
      recruiterId,
      {
        name,
        phone,
        companyName,
        industry,
        website,
        companySize,
        location,
        aboutCompany,
        hrName,
        hrEmail,
        hrPhone,
        ...(companyLogo && { companyLogo }),
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Recruiter profile updated successfully",
      recruiter: updatedRecruiter,
    });
  } catch (error) {
    console.error("Update Recruiter Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const getDashboardData = async (req, res) => {
  try {
    // ----------------------------
    // BASIC COUNTS
    // ----------------------------
    const totalJobseekers = await User.countDocuments({ role: "jobseeker" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    // ----------------------------
    // JOB STATUS STATS
    // ----------------------------
    const jobStatusStats = await Job.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // ----------------------------
    // APPLICATION STATUS STATS
    // ----------------------------
    const applicationStatusStats = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // ----------------------------
    // LATEST ENTRIES
    // ----------------------------
    const latestJobseekers = await User.find({ role: "jobseeker" })
      .sort({ createdAt: -1 })
      .limit(5);

    const latestRecruiters = await User.find({ role: "recruiter" })
      .sort({ createdAt: -1 })
      .limit(5);

    const latestJobs = await Job.find()
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const latestApplications = await Application.find()
      .populate("job", "jobTitle")
      .populate("applicant", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // ----------------------------
    // MONTHLY STATS (GRAPH DATA)
    // ----------------------------
    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyJobs = await Job.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyApplications = await Application.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // ----------------------------
    // FINAL RESPONSE
    // ----------------------------
    return res.status(200).json({
      success: true,
      stats: {
        totalJobseekers,
        totalRecruiters,
        totalJobs,
        totalApplications,
        jobStatusStats,
        applicationStatusStats,
      },
      latest: {
        latestJobseekers,
        latestRecruiters,
        latestJobs,
        latestApplications,
      },
      graphData: {
        monthlyUsers,
        monthlyJobs,
        monthlyApplications,
      },
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
      error: error.message
    });
  }
};


// import User from "../models/User.js";
// import Job from "../models/Job.js";
// import Application from "../models/Application.js";

// Controller to provide only analysis data for graphs/dashboard
export const getAnalysisData = async (req, res) => {
  try {
    // ----------------------------
    // TOTAL COUNTS
    // ----------------------------
    const [totalJobseekers, totalRecruiters, totalJobs, totalApplications] =
      await Promise.all([
        User.countDocuments({ role: "jobseeker" }),
        User.countDocuments({ role: "recruiter" }),
        Job.countDocuments(),
        Application.countDocuments(),
      ]);

    // ----------------------------
    // JOB STATUS STATS
    // ----------------------------
    const jobStatusStats = await Job.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // ----------------------------
    // APPLICATION STATUS STATS
    // ----------------------------
    const applicationStatusStats = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // ----------------------------
    // MONTHLY TRENDS (GRAPH DATA)
    // ----------------------------
    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyJobs = await Job.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyApplications = await Application.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // ----------------------------
    // SEND RESPONSE
    // ----------------------------
    return res.status(200).json({
      success: true,
      stats: {
        totalJobseekers,
        totalRecruiters,
        totalJobs,
        totalApplications,
        jobStatusStats,
        applicationStatusStats,
      },
      graphData: {
        monthlyUsers,
        monthlyJobs,
        monthlyApplications,
      },
    });
  } catch (error) {
    console.error("Analysis Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analysis data",
      error: error.message,
    });
  }
};


export const getAllApplications = async (req, res) => {
  try {
    const recruiterId = req.user._id; // from JWT middleware

    const {
      status,
      minExp,
      maxExp,
      skills,
      education,
      search,
      sortBy,
    } = req.query;

    // --------------------------
    // 1️⃣ Build Filters
    // --------------------------
    let filters = {};

    // Filter applications only for jobs created by this recruiter
    const recruiterJobs = await Job.find({ recruiter: recruiterId }).select("_id");

    filters.job = { $in: recruiterJobs.map((job) => job._id) };

    // Status Filter
    if (status && status !== "All") {
      filters.status = status;
    }

    // Experience Filter (years)
    if (minExp || maxExp) {
      filters["experience.years"] = {};
      if (minExp) filters["experience.years"].$gte = Number(minExp);
      if (maxExp) filters["experience.years"].$lte = Number(maxExp);
    }

    // Skills Filter
    if (skills) {
      const skillArray = skills.split(",").map((s) => s.trim());
      filters["applicant.skills"] = { $in: skillArray };
    }

    // Education Filter
    if (education) {
      filters["education.qualification"] = education;
    }

    // Search (name or email)
    if (search) {
      filters.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // --------------------------
    // 2️⃣ Sorting Logic
    // --------------------------
    let sortOption = { createdAt: -1 }; // default → newest first

    if (sortBy === "experience") {
      sortOption = { "experience.years": -1 };
    }

    if (sortBy === "status") {
      sortOption = { status: 1 };
    }

    // --------------------------
    // 3️⃣ Fetch Application Data
    // --------------------------
    const applications = await Application.find(filters)
      .populate("job", "jobTitle location experience")
      .populate("applicant", "name email skills experience education")
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


// Controller to get all details of an applicant
export const getApplicantDetails = async (req, res) => {
  try {
    const { applicantId } = req.params;

    // Fetch applicant details, populate references if they exist
    const applicant = await Application.findById(applicantId)
      .populate("job")
      .populate("experience")
      .populate("education");

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    res.status(200).json({ applicant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// import Application from "../models/Application.js";
// import Job from "../models/Job.js";

export const getRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = req.user._id; // from auth middleware

    const {
      status,
      experience,
      skill,
      search,
      sort = "latest",
    } = req.query;

    // 1️⃣ Get all jobs posted by this recruiter
    const jobs = await Job.find({ recruiter: recruiterId }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    if (!jobIds.length) {
      return res.json({ success: true, applications: [] });
    }

    // 2️⃣ Build filter query
    const query = {
      job: { $in: jobIds },
    };

    // Status filter
    if (status) {
      query.status = status;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Experience filter (years)
    if (experience) {
      query["experience.years"] = experience;
    }

    // Skills filter
    if (skill) {
      query["experience.skills"] = { $regex: skill, $options: "i" };
    }

    // 3️⃣ Sorting
    let sortOption = { createdAt: -1 }; // latest first

    if (sort === "experience") {
      sortOption = { "experience.years": -1 };
    }

    if (sort === "status") {
      sortOption = { status: 1 };
    }

    // 4️⃣ Fetch Applications
    const applications = await Application.find(query)
      .populate("job", "jobTitle location jobType")
      .populate("applicant", "name email phone profilePicture")
      .sort(sortOption);

    res.status(200).json({
      success: true,
      total: applications.length,
      applications,
    });

  } catch (error) {
    console.error("Get Recruiter Applications Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};



export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application
      .findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      )
      .populate("job applicant recruiter");

    // recruiter info
    const recruiterName = application.recruiter.fullName;
    const companyName = application.job.companyName;

    // jobseeker info
    const jobseekerEmail = application.applicant.email;
    const jobseekerName = application.applicant.fullName;

    // email content
    const emailTemplates = {
      Accepted: `
        <h2>Congratulations ${jobseekerName} 🎉</h2>
        <p>You have been selected for <b>${application.job.jobTitle}</b>.</p>
      `,
      Rejected: `
        <h2>Application Update</h2>
        <p>Thank you for applying. Unfortunately, you were not selected.</p>
      `,
      Shortlisted: `
        <h2>Shortlisted</h2>
        <p>Your profile has been shortlisted.</p>
      `
    };

    // send mail
    await sendMail({
      portalName: "HireFast",
      recruiterName,
      companyName,
      to: jobseekerEmail,
      subject: `Application ${status}`,
      html: emailTemplates[status]
    });

    res.json({ success: true, message: "Status updated & mail sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const getRecruiterJobsWithApplications = async (req, res) => {
  try {
    const recruiterId = req.user.id; // from auth middleware

    // Get recruiter jobs
    const jobs = await Job.find({ recruiter: recruiterId });

    // Add total applications count per job
    const jobData = await Promise.all(
      jobs.map(async (job) => {
        const totalApplications = await Application.countDocuments({
          job: job._id
        });

        return {
          jobId: job._id,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          totalApplications
        };
      })
    );

    res.status(200).json({
      success: true,
      jobs: jobData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter jobs"
    });
  }
};

export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "-password")
      .populate("job");

    res.status(200).json({
      success: true,
      totalApplicants: applications.length,
      applicants: applications.map((app) => ({
        applicationId: app._id,
        status: app.status,
        appliedAt: app.createdAt,

        // Job info
        job: {
          jobTitle: app.job.jobTitle,
          companyName: app.job.companyName
        },

        // Applicant info
        applicant: {
          id: app.applicant._id,
          fullName: app.applicant.fullName,
          email: app.applicant.email,
          phone: app.applicant.phone,
          applicantPhoto: app.applicant.applicantPhoto,
          resumeUrl: app.resumeUrl,
          education: app.applicant.education,
          experience: app.applicant.experience
        }
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applicants"
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    // Only recruiter can delete
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can delete applications",
      });
    }

    const { id } = req.params;

    // Find application
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Delete application
    await Application.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete Application Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const scheduleInterview = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;
    const { date, time } = req.body;

    const application = await Application.findById(id)
      .populate("applicant")
      .populate("job");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const meetLink = `https://meet.google.com/${crypto.randomBytes(3).toString("hex")}`;

    application.status = "Interview Scheduled";
    application.interviewDate = date;
    application.interviewTime = time;
    application.meetLink = meetLink;
    await application.save();

    await sendInterviewEmail({
      applicant: application.applicant,
      job: application.job,
      date,
      time,
      meetLink
    });

    res.json({
      success: true,
      message: "Interview scheduled & email sent successfully",
    });
  } catch (error) {
    console.error("Interview Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
