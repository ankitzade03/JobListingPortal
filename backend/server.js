import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import jobSeeker from "./routes/jobseeker.js"
import recruiter from "./routes/recruiter.js"
import passport from "passport";
import './config/passport.js'
connectDB(); // connect to MongoDB

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("API is running...");
});


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/jobseeker",jobSeeker);

app.use("/api/recruiter", recruiter);




const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




// {
//    "email": "ankitzade12@gmail.com",
//   "password": "123456"  
// }

// {
//    "email": "hr123@gmail.com",
//   "password": "123456"  
// }