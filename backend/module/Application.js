

import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user with role = jobseeker
      required: true,
    },

    // PERSONAL DETAILS
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    address: { type: String, required: true },

    // APPLICANT PHOTO (New Field Added)
    applicantPhoto: {
      type: String,      // Cloudinary URL
      required: false,   // optional
    },

    // EDUCATION DETAILS
    education: [
      {
        qualification: { type: String, required: true },
        college: { type: String, required: true },
        passingYear: { type: String, required: true },
        grade: { type: String, required: true },
      },
    ],

    // EXPERIENCE DETAILS
    experience: [
      {
        years: { type: String, required: true },
        company: { type: String, required: true },
        role: { type: String, required: true },
        skills: { type: String, required: true },
      },
    ],

    // FILES
    resumeUrl: { type: String, required: true },
    coverLetter: String,

    status: {
      type: String,
      enum: [
        "Submitted",
        "Shortlisted",
        "Interview Scheduled", // ✅ ADD THIS
        "Accepted",
        "Rejected",
      ],
      default: "Submitted",
    },


    recruiterNotes: String,
  },

  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
