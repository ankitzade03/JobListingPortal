// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });


// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });
// import { transporter } from "../../config/mailer.js";

// export const sendMail = async ({
//   to,
//   subject,
//   html,
//   recruiterName,
//   companyName,
// }) => {

//   await transporter.sendMail({
//     from: `"HireFast Notifications" <${process.env.SMTP_EMAIL}>`, // 🔒 NO-REPLY
//     to,
//     subject,

//     // 👇 recruiter visible but NOT exposable
//     replyTo: `"${recruiterName} (${companyName})" <${process.env.SMTP_EMAIL}>`,

//     html,
//   });
// };




// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });


// import { transporter } from "../config/mailer.js";

// export const sendMail = async ({
//   recruiterName,
//   recruiterEmail,
//   candidateEmail,
//   subject,
//   html
// }) => {
//   await transporter.sendMail({
//     from: `"${recruiterName}" <${recruiterEmail}>`,
//     replyTo: recruiterEmail,
//     to: candidateEmail,
//     subject,
//     html
//   });
// };

// import { transporter } from "../config/mailer.js";

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // jobportal.recruitment@gmail.com
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },

});


export const sendMail = async ({
  companyName,
  candidateEmail,
  subject,
  html,
  
}) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

  await transporter.sendMail({
    from: `"${companyName} Recruitment Team" <${process.env.EMAIL_USER}>`,
    to: candidateEmail,
    subject,
    html,

    // optional: if you want replies to go to company HR
    // replyTo: "hr@company.com"
  });
};

