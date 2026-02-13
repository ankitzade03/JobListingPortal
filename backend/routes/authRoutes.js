// import express from "express";
// import { loginUser, registerUser } from "../controller/authController.js";
// import passport from "passport";


// const router = express.Router();

// // Register
// router.post("/register", registerUser);

// // Login
// router.post("/login", loginUser);

// const generateToken = (user) =>
//   jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });

// // Google
// router.get("/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get("/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     const token = generateToken(req.user);
//     res.redirect(`http://localhost:5173/oauth-success?token=${token}&role=${req.user.role}`);
//   }
// );

// export default router;


import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { loginUser, registerUser } from "../controller/authController.js";

const router = express.Router();

/* =====================
   NORMAL AUTH
===================== */

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

/* =====================
   JWT GENERATOR
===================== */
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

/* =====================
   GOOGLE OAUTH
===================== */

// Step 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);

    res.redirect(
      `http://localhost:5173/oauth-success?token=${token}&role=${req.user.role}`
    );
  }
);

export default router;
