import jwt from "jsonwebtoken";
import User from "../module/User.js";


// // Protect any route
// export const protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ success: false, message: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }

//     req.user = user; // attach user object
//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };


export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    console.log("TOKEN CHECK="+token);


    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};


export const isJobSeeker = (req, res, next) => {
  if (req.user.role !== "jobseeker") {
    return res.status(403).json({ success: false, message: "Access denied. JobSeeker only." });
  }
  next();
};

export const isRecruiter = (req, res, next) => {
  if (req.user.role !== "recruiter") {
    console.log("ROLE CHECK →", req.user.role);

    return res.status(403).json({ success: false, message: "Access denied. Recruiter only." });
  }
  next();
};


export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");

    // Attach user object to request
    const user = await User.findById(decoded.id).select("-password"); // exclude password
    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user;
    next();

  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({ msg: "Token is invalid or expired" });
  }
};
