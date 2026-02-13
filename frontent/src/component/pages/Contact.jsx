
import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const ContactPage = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* HERO SECTION */}
      <section
        className="relative h-[60vh] flex items-center justify-center text-center px-6"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative text-white max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Get in Touch
          </h1>
          <p className="mt-5 text-lg text-gray-200">
            Questions about jobs, employers, or your account?  
            Our team is always ready to help.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Let’s Talk
          </h2>
          <p className="mt-5 text-gray-600 text-lg">
            Reach out to us anytime — whether you’re a job seeker looking for
            guidance or an employer seeking talent.
          </p>

          {/* CONTACT CARDS */}
          <div className="mt-10 space-y-6">
            <InfoCard
              icon={<Mail />}
              title="Email"
              value="support@jobportal.com"
            />
            <InfoCard
              icon={<Phone />}
              title="Phone"
              value="+91 98765 43210"
            />
            <InfoCard
              icon={<MapPin />}
              title="Office"
              value="Bangalore, India"
            />
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white shadow-2xl rounded-3xl p-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Send us a message
          </h3>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <textarea
              placeholder="Write your message..."
              className="w-full p-4 h-32 rounded-xl bg-gray-100 outline-none resize-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold transition hover:scale-105"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

/* SMALL COMPONENT */

const InfoCard = ({ icon, title, value }) => (
  <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
    <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);

