import { sendMail } from "../controller/mailservers/mailServers.js";
import Application from "../module/Application.js";

export const scheduleInterview = async (req, res) => {
  const { interviewDate, interviewTime } = req.body;

  const application = await Application
    .findByIdAndUpdate(
      req.params.id,
      { interviewDate, interviewTime, status: "Interview Scheduled" },
      { new: true }
    )
    .populate("job applicant recruiter");

  await sendMail({
    portalName: "HireFast",
    recruiterName: application.recruiter.fullName,
    companyName: application.job.companyName,
    to: application.applicant.email,
    subject: "Interview Scheduled",
    html: `
      <h2>Interview Scheduled</h2>
      <p>Date: ${interviewDate}</p>
      <p>Time: ${interviewTime}</p>
      <p>Position: ${application.job.jobTitle}</p>
    `
  });

  res.json({ success: true });
};
