import { sendMail } from "../../config/mailer.js";


export const sendInterviewEmail = async ({
  applicant,
  job,
  date,
  time,
  meetLink
}) => {
  await sendMail({
    companyName: job.companyName,
    candidateEmail: applicant.email,
    subject: `Interview Scheduled – ${job.jobTitle}`,
    html: `
      <h2>Hello ${applicant.name},</h2>

      <p>Your interview has been scheduled.</p>

      <p><strong>Position:</strong> ${job.jobTitle}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Meeting Link:</strong>
        <a href="${meetLink}">${meetLink}</a>
      </p>

      <br/>
      <p>Regards,</p>
      <p><strong>${job.companyName} Recruitment Team</strong></p>
    `
  });
};
