
import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  memo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SoftContext } from "../../../context/SoftContext";
import toast from "react-hot-toast";
import { API_URL } from "../../config/api";

/* ================= INPUT STYLE ================= */
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition";

/* ================= INITIAL STATES ================= */
const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  fatherName: "",
  motherName: "",
  address: "",
};

const initialEducation = [
  { qualification: "", college: "", passingYear: "", grade: "" },
];

const initialExperience = [
  { years: "", company: "", role: "", skills: "" },
];

/* ================= MAIN COMPONENT ================= */
export const RegistrationWizard = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(SoftContext);

  /* ================= JOB ================= */
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);

  /* ================= FORM ================= */
  const [formData, setFormData] = useState(initialForm);
  const [education, setEducation] = useState(initialEducation);
  const [experience, setExperience] = useState(initialExperience);
  const [resume, setResume] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH JOB ================= */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/jobseeker/job/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error("Job not found");
        setJob(data.job);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setJobLoading(false);
      }
    };
    fetchJob();
  }, [jobId, token]);

  /* ================= HANDLERS ================= */
  const handleInput = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  const handleEducation = (i, field, value) => {
    setEducation((p) => {
      const copy = [...p];
      copy[i][field] = value;
      return copy;
    });
  };

  const handleExperience = (i, field, value) => {
    setExperience((p) => {
      const copy = [...p];
      copy[i][field] = value;
      return copy;
    });
  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {
  for (const value of Object.values(formData)) {
    if (!value) return "Please fill all personal information fields";
  }

  for (const edu of education) {
    for (const val of Object.values(edu)) {
      if (!val) return "Please complete all education fields";
    }
  }

  return null;
};


  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);   // ✅ toast here
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));

      data.append("education", JSON.stringify(education));

      if (
        experience.length &&
        experience.some((e) => Object.values(e).some((v) => v))
      ) {
        data.append("experience", JSON.stringify(experience));
      }

      if (resume) data.append("resume", resume);
      if (photo) data.append("applicantPhoto", photo);

      const res = await fetch(
        `${API_URL}/api/jobseeker/apply/${jobId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.msg || "Apply failed");

      toast.success("Application submitted successfully 🚀");

      /* RESET */
      setFormData(initialForm);
      setEducation(initialEducation);
      setExperience(initialExperience);
      setResume(null);
      setPhoto(null);

      /* REDIRECT */
      setTimeout(() => {
        navigate("/jobseeker/my-applications");
      }, 1500);

    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (jobLoading) return <p className="text-center mt-10">Loading job...</p>;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-xl">

        {/* JOB HEADER */}
        <div className="mb-10 flex items-center gap-6">
          <img src={job.companyLogo} className="h-20 w-20 rounded-xl border" />
          <div>
            <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
            <p className="text-slate-600">{job.companyName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">

          <Section title="Personal Information">
            <Grid>
              <Input label="Full Name" name="fullName" onChange={handleInput} />
              <Input label="Email" name="email" onChange={handleInput} />
              <Input label="Phone" name="phone" onChange={handleInput} />
              <Input type="date" label="DOB" name="dob" onChange={handleInput} />
              <Select label="Gender" name="gender" options={["Male","Female","Other"]} onChange={handleInput} />
              <Input label="Father Name" name="fatherName" onChange={handleInput} />
              <Input label="Mother Name" name="motherName" onChange={handleInput} />
            </Grid>
            <Textarea label="Address" name="address" onChange={handleInput} />
          </Section>

          <Section title="Education">
            {education.map((_, i) => (
              <Card
                key={i}
                title={`Education ${i + 1}`}
                onRemove={() =>
                  education.length > 1 &&
                  setEducation((p) => p.filter((_, idx) => idx !== i))
                }
              >
                <Grid cols="lg:grid-cols-4">
                  <Input label="Qualification" onChange={(e) => handleEducation(i,"qualification",e.target.value)} />
                  <Input label="College" onChange={(e) => handleEducation(i,"college",e.target.value)} />
                  <Input label="Passing Year" onChange={(e) => handleEducation(i,"passingYear",e.target.value)} />
                  <Input label="Grade" onChange={(e) => handleEducation(i,"grade",e.target.value)} />
                </Grid>
              </Card>
            ))}
            <AddButton onClick={() => setEducation(p => [...p, ...initialEducation])} label="Add Education" />
          </Section>

          <Section title="Experience (Optional)">
            {experience.map((_, i) => (
              <Card
                key={i}
                title={`Experience ${i + 1}`}
                onRemove={() =>
                  experience.length > 1 &&
                  setExperience((p) => p.filter((_, idx) => idx !== i))
                }
              >
                <Grid cols="lg:grid-cols-4">
                  <Input label="Years" onChange={(e) => handleExperience(i,"years",e.target.value)} />
                  <Input label="Company" onChange={(e) => handleExperience(i,"company",e.target.value)} />
                  <Input label="Role" onChange={(e) => handleExperience(i,"role",e.target.value)} />
                  <Input label="Skills" onChange={(e) => handleExperience(i,"skills",e.target.value)} />
                </Grid>
              </Card>
            ))}
            <AddButton onClick={() => setExperience(p => [...p, ...initialExperience])} label="Add Experience" />
          </Section>

          <Section title="Documents">
            <Grid cols="md:grid-cols-2">
              <FileInput label="Resume" onChange={(e) => setResume(e.target.files[0])} />
              <FileInput label="Photo" onChange={(e) => setPhoto(e.target.files[0])} />
            </Grid>
          </Section>

          <button disabled={loading} className="w-full rounded-xl bg-indigo-600 py-4 text-lg font-semibold text-white">
            {loading ? "Submitting..." : "Apply Now 🚀"}
          </button>

        </form>
      </div>
    </div>
  );
};

/* ================= REUSABLE ================= */

const Section = memo(({ title, children }) => (
  <section className="space-y-5">
    <h2 className="text-lg font-semibold text-indigo-600">{title}</h2>
    {children}
  </section>
));

const Grid = ({ children, cols = "md:grid-cols-3" }) => (
  <div className={`grid grid-cols-1 gap-5 ${cols}`}>{children}</div>
);

const Card = ({ title, children, onRemove }) => (
  <div className="relative rounded-xl border bg-slate-50 p-4">
    <button type="button" onClick={onRemove} className="absolute right-3 top-2 text-red-500">✕</button>
    <p className="mb-3 font-medium">{title}</p>
    {children}
  </div>
);

const AddButton = ({ onClick, label }) => (
  <button type="button" onClick={onClick} className="text-indigo-600 font-semibold text-sm">
    + {label}
  </button>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <input {...props} className={inputClass} />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <textarea {...props} className={`${inputClass} min-h-[90px]`} />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <select {...props} className={inputClass}>
      <option value="">Select</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const FileInput = ({ label, onChange }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <input type="file" onChange={onChange} />
  </div>
);
