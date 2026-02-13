
import React from "react";
import { Briefcase, Users, ShieldCheck, Mail, Phone } from "lucide-react";

export const Aboutpage = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HERO SECTION */}
      <section
        className="relative h-[70vh] flex items-center justify-center text-center px-6"
        style={{
          backgroundImage: `url(${`/urlpic.jpg`})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-3xl text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Empowering Careers. <br /> Connecting Futures.
          </h1>
          <p className="mt-6 text-lg text-gray-200">
            We help job seekers discover meaningful opportunities and employers
            find the right talent — faster, smarter, and more securely.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            About Our Job Portal
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            Our platform is built for modern job seekers. From verified
            employers to smart job matching, we ensure transparency, trust, and
            career growth at every step.
          </p>

          <div className="mt-8 space-y-5">
            <Feature icon={<Briefcase />} title="Verified Jobs">
              Every listing is reviewed to protect job seekers from fraud.
            </Feature>

            <Feature icon={<Users />} title="Career-Focused Community">
              Connect with employers and professionals that value your skills.
            </Feature>

            <Feature icon={<ShieldCheck />} title="Secure & Reliable">
              Your data is protected with enterprise-grade security.
            </Feature>
          </div>
        </div>

        {/* IMAGE */}
        <div className="relative">
          <img
            src="/team.jpg"
            alt="Team working"
            className="rounded-3xl shadow-2xl"
          />
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-white text-center">
          <ContactCard
            icon={<Mail />}
            title="Email Us"
            value="support@jobportal.com"
          />
          <ContactCard
            icon={<Phone />}
            title="Call Support"
            value="+91 98765 43210"
          />
          <ContactCard
            icon={<Users />}
            title="Career Help"
            value="24/7 Job Assistance"
          />
        </div>
      </section>
    </div>
  );
};

/* COMPONENTS */

const Feature = ({ icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">{icon}</div>
    <div>
      <h4 className="font-semibold text-lg text-gray-800">{title}</h4>
      <p className="text-gray-600 mt-1">{children}</p>
    </div>
  </div>
);

const ContactCard = ({ icon, title, value }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition">
    <div className="mx-auto w-fit mb-4 text-white">{icon}</div>
    <h4 className="font-semibold text-xl">{title}</h4>
    <p className="mt-2 text-gray-200">{value}</p>
  </div>
);
