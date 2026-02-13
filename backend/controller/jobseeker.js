import Application from "../module/Application.js";
import Job from "../module/Job.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../module/User.js";


export const updateJobseekerProfile = async (req, res) => {
  try {
    const userId = req.user.id;  // From JWT

    const {
      name,
      phone,
      dob,
      address,
      city,
      state,
      bio,
      currentPosition,
      experienceLevel,
      linkedin,
      github,
      website,
      skills,
      education,
      experience
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== "jobseeker") {
      return res.status(400).json({ success: false, message: "Only jobseekers can update this profile" });
    }

    // BASIC INFO UPDATE
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (dob) user.dob = dob;
    if (address) user.address = address;
    if (city) user.city = city;
    if (state) user.state = state;

    // ABOUT SECTION
    if (bio) user.bio = bio;
    if (currentPosition) user.currentPosition = currentPosition;
    if (experienceLevel) user.experienceLevel = experienceLevel;

    // SOCIAL LINKS
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;
    if (website) user.website = website;

    // SKILLS → convert comma-separated list into array
    if (skills) {
      user.skills = skills.split(",").map((s) => s.trim());
    }

    // EDUCATION ARRAY
    if (education) {
      user.education = JSON.parse(education); 
      // Example in Postman:
      // education: '[{"level":"B.Tech","institution":"XYZ","passingYear":"2024","percentage":86}]'
    }

    // EXPERIENCE ARRAY
    if (experience) {
      user.experience = JSON.parse(experience);
    }

    // PROFILE PICTURE UPLOAD (Cloudinary link is already in req.file.path)
    if (req.file && req.file.path) {
      user.profilePicture = req.file.path;
    }

    await user.save();

    res.json({
      success: true,
      message: "Jobseeker profile updated successfully",
      user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message
    });
  }
};










export const getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Fetch job and populate recruiter user
    const job = await Job.findById(jobId)
      .populate("recruiter", "name email companyName companyLogo industry website companySize location aboutCompany hrName hrEmail hrPhone");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });

  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Applicant ID from auth middleware
    const applicant = req.user._id;

    const {
      coverLetter,
      fullName,
      email,
      phone,
      dob,
      gender,
      fatherName,
      motherName,
      address,
      education,
      experience
    } = req.body;

    // Validate Job ID
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // Prevent duplicate application
    const alreadyApplied = await Application.findOne({ job: jobId, applicant });
    if (alreadyApplied) {
      return res.status(400).json({ msg: "You already applied for this job" });
    }

    // -------------------------------
    // RESUME & PHOTO UPLOAD
    // -------------------------------

    let resumeUrl = null;
    let applicantPhoto = null;

    // req.files for multiple uploads
    if (req.files) {
      // Resume
      if (req.files.resume && req.files.resume[0]) {
        resumeUrl = req.files.resume[0].path;
      }

      // Applicant Photo
      if (req.files.applicantPhoto && req.files.applicantPhoto[0]) {
        applicantPhoto = req.files.applicantPhoto[0].path;
      }
    }

    // JSON Parse Education + Experience
    const parsedEducation = education ? JSON.parse(education) : [];
    const parsedExperience = experience ? JSON.parse(experience) : [];

    // -------------------------------
    // Create Application
    // -------------------------------
    const application = await Application.create({
      job: jobId,
      applicant,

      coverLetter,
      resumeUrl,
      applicantPhoto,  // NEW FIELD ADDED

      fullName,
      email,
      phone,
      dob,
      gender,
      fatherName,
      motherName,
      address,

      education: parsedEducation,
      experience: parsedExperience,
    });

    res.status(201).json({
      success: true,
      msg: "Application submitted successfully",
      application,
    });

  } catch (err) {
    console.error("Apply Job Error:", err);
    res.status(500).json({
      msg: "Server Error",
      error: err.message,
    });
  }
};


// import Application from "../models/application.model.js";

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job")          // populate job details
      .populate("applicant");   // populate user details

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
      error: error.message,
    });
  }
};

// import Job from "../models/job.js";

export const getAllJobsForJobseeker = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate(
        "recruiter",
        "name email companyName companyLogo hrName hrEmail hrPhone"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All jobs fetched successfully",
      totalJobs: jobs.length,
      jobs,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching jobs",
      error: error.message,
    });
  }
};


export const getAllJobs = async (req, res) => {
  try {
    const { title, location, category } = req.query;

    const filter = {};

    if (title) filter.jobTitle = { $regex: title, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };

    const jobs = await Job.find(filter)
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// controllers/user.controller.js

// import User from "../models/User.js";
// import cloudinary from "../config/cloudinary.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      fullName,
      phone,
      about,
      skills,
      companyName,
      designation,
      linkedin,
      github,
      portfolio,
    } = req.body;

    // -----------------------------------
    // 1. UPLOAD PROFILE PIC IF PROVIDED
    // -----------------------------------
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload_stream(
        { folder: "profile_pictures" },
        (error, result) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ message: "Error uploading profile picture" });
          }
        }
      );

      const stream = cloudinary.uploader.upload_stream(
        { folder: "profile_pictures" },
        (error, result) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ message: "Error uploading profile picture" });
          } else {
            user.profilePic = result.secure_url;
            user.save();
          }
        }
      );

      stream.end(req.file.buffer);
    }

    // -----------------------------------
    // 2. UPDATE COMMON FIELDS
    // -----------------------------------
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (about) user.about = about;

    // Convert "React, Node, Mongo" → ["React","Node","Mongo"]
    if (skills) {
      user.skills = skills.split(",").map((s) => s.trim());
    }

    // -----------------------------------
    // 3. ROLE BASED FIELDS
    // -----------------------------------

    // JOBSEEKER
    if (user.role === "jobseeker") {
      if (linkedin) user.socialLinks.linkedin = linkedin;
      if (github) user.socialLinks.github = github;
      if (portfolio) user.socialLinks.portfolio = portfolio;
    }

    // RECRUITER
    if (user.role === "recruiter") {
      if (companyName) user.companyName = companyName;
      if (designation) user.designation = designation;

      if (linkedin) user.socialLinks.linkedin = linkedin;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("Profile update error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// export const deleteApplication = async (req, res) => {
//   try {
//     const applicationId = req.params.id;
//     const userId = req.user._id; // set by auth middleware

//     // 🔍 Find application
//     const application = await Application.findById(applicationId);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         msg: "Application not found",
//       });
//     }

//     // 🔒 Ensure application belongs to logged-in user
//     if (application.applicant.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         msg: "You are not authorized to delete this application",
//       });
//     }

//     // ❌ Optional: block delete after interview / accepted
//     if (["Interview Scheduled", "Accepted"].includes(application.status)) {
//       return res.status(400).json({
//         success: false,
//         msg: "You cannot delete this application at this stage",
//       });
//     }

//     // 🗑 Delete application
//     await application.deleteOne();

//     res.status(200).json({
//       success: true,
//       msg: "Application deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete application error:", error);
//     res.status(500).json({
//       success: false,
//       msg: "Server error while deleting application",
//     });
//   }
// };


// import mongoose from "mongoose";
// import Application from "../models/applicationModel.js";

// export const deleteApplication = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id; // from auth middleware

//     // 1️⃣ Validate MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         msg: "Invalid application id",
//       });
//     }

//     // 2️⃣ Find application
//     const application = await Application.findById(id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         msg: "Application not found",
//       });
//     }

//     // 3️⃣ Authorization check (jobseeker can delete ONLY own application)
//     if (application.applicant.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         msg: "You are not authorized to delete this application",
//       });
//     }

//     // 4️⃣ Delete
//     await Application.findByIdAndDelete(id);

//     return res.status(200).json({
//       success: true,
//       msg: "Application deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete Application Error:", error);
//     return res.status(500).json({
//       success: false,
//       msg: "Server error while deleting application",
//     });
//   }
// };


// export const deleteApplication = async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log("DELETE ID:", id);
//     console.log("USER:", req.user);

//     const userId = req.user?._id;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         msg: "User not authenticated",
//       });
//     }

//     const application = await Application.findById(id);

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         msg: "Application not found",
//       });
//     }

//     if (application.applicant.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         msg: "Unauthorized",
//       });
//     }

//     await application.deleteOne();

//     res.status(200).json({
//       success: true,
//       msg: "Application deleted successfully",
//     });
//   } catch (error) {
//     console.error("❌ DELETE ERROR:", error);
//     res.status(500).json({
//       success: false,
//       msg: "Server error while deleting application",
//     });
//   }
// };


export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const deletedApplication = await Application.findOneAndDelete({
      _id: id,
      applicant: userId, // 🔒 ownership check
    });

    if (!deletedApplication) {
      return res.status(404).json({
        success: false,
        msg: "Application not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Application deleted successfully",
    });
  } catch (error) {
    console.error("DELETE APPLICATION ERROR:", error);
    res.status(500).json({
      success: false,
      msg: "Server error while deleting application",
    });
  }
};
