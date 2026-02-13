import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Error:", err))
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};
