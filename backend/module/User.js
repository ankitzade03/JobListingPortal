

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // BASIC USER INFO
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ROLE
    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin"],
      required: true
    },

    // -----------------------------------------
    // JOBSEEKER FIELDS
    // -----------------------------------------
    phone: String,
    dob: Date,
    address: String,
    skills: [String],
    resumeUrl: String,
    profilePicture: String,
    
    bio: String,
    currentPosition: String, // student, fresher, software engineer, etc.
    experienceLevel: String,  // Fresher, Intermediate, Expert
    linkedin: String,
    github: String,
    website: String,
    city: String,
    state: String,

    education: [
      {
        level: String,
        institution: String,
        passingYear: String,
        percentage: Number
      }
    ],

    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String
      }
    ],

    // Jobs the jobseeker applied for
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Application" }
    ],

    // -----------------------------------------
    // RECRUITER FIELDS
    // -----------------------------------------
    companyName: String,
    companyLogo: String,
    industry: String,
    website: String,
    companySize: String,
    location: String,
    aboutCompany: String,

    hrName: String,
    hrEmail: String,
    hrPhone: String,

    // Jobs posted by this recruiter
    jobsPosted: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Job" }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
