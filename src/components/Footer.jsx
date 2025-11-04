import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-stone-800 to-gray-950 text-stone-200 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center  pb-5 mb-1">
          {/* Logo  */}
          <div className="mb-10 md:mb-0">
            <h2 className="text-4xl font-extrabold text-white mb-3 font-playfair tracking-wider">
              Fork&Flame
            </h2>
            <p className="text-base italic text-stone-400 font-serif">
              The Taste Of Nature
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-16 text-lg">
            <Link
              to="/menu"
              className="hover:text-white transition-colors duration-300 transform hover:scale-105"
            >
              Menu
            </Link>

            <Link
              to="/reservation"
              className="hover:text-white transition-colors duration-300 transform hover:scale-105"
            >
              Reservations
            </Link>
            <Link
              to="/"
              className="hover:text-white transition-colors duration-300 transform hover:scale-105"
            >
              Home
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Contact Info */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-semibold text-white mb-5 font-playfair">
              Contact & Location
            </h3>
            <p className="text-stone-300 text-lg">Kochi</p>
            <p className="text-stone-300 text-lg mt-3">Phone:+9112345678</p>
            <p className="text-stone-300 text-lg">
              Email:fork&flame@example.com
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-8 text-2xl">
            <FaFacebookF className="hover:text-blue-500 transition-colors duration-300 transform hover:scale-110" />

            <FaInstagram className="hover:text-pink-600 transition-colors duration-300 transform hover:scale-110" />

            <FaTwitter className="hover:text-sky-400 transition-colors duration-300 transform hover:scale-110" />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-5 text-center text-sm text-indigo-500">
          <p>
            &copy; {new Date().getFullYear()} Fork &Flame. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
