
import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-gray-800">

      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[420px] w-full overflow-hidden">
        <img
          src="/contact-hero.jpg" // <-- Use your image here
          alt="Contact Banner"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center px-6">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold drop-shadow-xl animate-fadeIn">
            Get in Touch
          </h1>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-12 md:-mt-16 grid md:grid-cols-3 gap-6">
        
        <div className="backdrop-blur-lg bg-white/60 p-6 rounded-2xl shadow-xl hover:scale-[1.03] transition-all duration-300">
          <Mail className="text-indigo-600 w-12 h-12 mb-3" />
          <h3 className="font-bold text-xl">Email Us</h3>
          <p className="text-gray-700 mt-2">support@jobportal.com</p>
        </div>

        <div className="backdrop-blur-lg bg-white/60 p-6 rounded-2xl shadow-xl hover:scale-[1.03] transition-all duration-300">
          <Phone className="text-blue-600 w-12 h-12 mb-3" />
          <h3 className="font-bold text-xl">Call Us</h3>
          <p className="text-gray-700 mt-2">+91 9876543210</p>
        </div>

        <div className="backdrop-blur-lg bg-white/60 p-6 rounded-2xl shadow-xl hover:scale-[1.03] transition-all duration-300">
          <MapPin className="text-purple-600 w-12 h-12 mb-3" />
          <h3 className="font-bold text-xl">Visit Us</h3>
          <p className="text-gray-700 mt-2">Nagpur, Maharashtra, India</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto mt-20 px-6 md:px-10 mb-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 drop-shadow-sm">
          Send Us a Message
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-10">
          Have questions? Fill the form below and we'll reply ASAP.
        </p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-200 animate-slideUp">

          <input
            type="text"
            placeholder="Full Name"
            className="p-3 border rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="p-3 border rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="p-3 border rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />

          <input
            type="text"
            placeholder="Subject"
            className="p-3 border rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />

          <textarea
            placeholder="Write your message..."
            className="md:col-span-2 p-3 border rounded-lg bg-gray-50 focus:bg-white h-40 outline-none focus:ring-2 focus:ring-indigo-600 transition"
          ></textarea>

          <button
            type="submit"
            className="md:col-span-2 flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-[1.05]"
          >
            <Send className="w-5 h-5" />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
