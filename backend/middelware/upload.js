

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Load .env
import dotenv from "dotenv";
dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: "dkhxqvhlt",
  api_key: "975987523132265",
  api_secret: "_S7UAnhhxWpEZ9lrax73FI72e14",
});

// Allowed file types
const allowedMimes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

// Storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (!allowedMimes.includes(file.mimetype)) {
      throw new Error("Invalid file type: " + file.mimetype);
    }

    return {
      folder: "jobportal_uploads",
      resource_type: "raw", // IMPORTANT for PDF
      public_id: `${file.fieldname}-${Date.now()}`,
      format: file.mimetype === "application/pdf" ? "pdf" : undefined,
    };
  },
});

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

export default upload;
