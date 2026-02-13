


import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    jobTitle: { type: String, required: true },
    category: { type: String, required: true },
    employmentType: { type: String },
    workMode: { type: String },

    location: { type: String, required: true },
    salary: { type: String, required: true },
    experience: { type: String, required: true },
    openings: { type: Number, required: true },

    deadline: { type: Date, required: true },

    responsibilities: [String],
    requirements: [String],
    skills: [String],

    aboutRole: String,

    companyName: { type: String, required: true },
    industry: { type: String, required: true },
    website: String,
    companyOverview: String,

    companyLogo: String,

    // Applications received for this job
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Application" }
    ],
    // postedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },

    status: {
      type: String,
      enum: ["Open", "Closed", "On Hold"],
      default: "Open"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
