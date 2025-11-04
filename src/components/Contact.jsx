import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Phone, Mail, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Contact Section */}
      <div className="flex flex-col items-center justify-center flex-grow px-4 py-12 bg-gray-50">
        <div
          className="
            w-full 
            max-w-6xl 
            bg-white 
            rounded-2xl 
            shadow-2xl 
            border border-gray-100 
            p-6 
            sm:p-10 
            md:p-14 
            transition-all 
            duration-300 
            hover:shadow-3xl
          "
        >
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4">
            Let’s Connect
          </h2>
          <p className="text-center text-gray-500 text-sm md:text-lg mb-10">
            We're just a call or email away for reservations, inquiries, or any feedback you'd like to share.
          </p>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {/* Phone */}
            <div className="flex flex-col items-center text-center bg-indigo-50 rounded-xl p-6 hover:bg-indigo-100 hover:shadow-md transition">
              <div className="p-3 bg-indigo-600 rounded-full mb-3">
                <Phone className="text-white w-6 h-6" />
              </div>
              <p className="text-sm uppercase font-semibold text-gray-500 mb-1">
                Phone
              </p>
              <a
                href="tel:+911234567890"
                className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition"
              >
                +91 12345 67890
              </a>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center text-center bg-indigo-50 rounded-xl p-6 hover:bg-indigo-100 hover:shadow-md transition">
              <div className="p-3 bg-indigo-600 rounded-full mb-3">
                <Mail className="text-white w-6 h-6" />
              </div>
              <p className="text-sm uppercase font-semibold text-gray-500 mb-1">
                Email
              </p>
              <a
                href="mailto:forkandflame@example.com"
                className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition"
              >
                forkandflame@exgmail.com
              </a>
            </div>

            {/* Location */}
            <div className="flex flex-col items-center text-center bg-indigo-50 rounded-xl p-6 hover:bg-indigo-100 hover:shadow-md transition">
              <div className="p-3 bg-indigo-600 rounded-full mb-3">
                <MapPin className="text-white w-6 h-6" />
              </div>
              <p className="text-sm uppercase font-semibold text-gray-500 mb-1">
                Location
              </p>
              <p className="text-lg font-medium text-gray-800">
                Kochi, Kerala, India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
