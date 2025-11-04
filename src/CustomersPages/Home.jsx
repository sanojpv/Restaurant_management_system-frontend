import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import banner from "../assets/banner-image.png";
import aboutImg from "../assets/forkandflame-logo.png";
import { Link } from "react-router-dom";
import { List, ArrowRight, Star, Utensils, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Home = () => {
  const [rotate, setRotate] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setRotate(currentScrollY * 0.1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const primaryColor = "text-green-800";
  const primaryBg = "bg-green-700";
  const primaryHoverBg = "hover:bg-green-600";
  const accentColor = "text-amber-500";

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 antialiased">
      <Navbar />

      {/*  Hero Section  Scroll-based rotation  */}

      <section className="min-h-[100vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 pt-24 mt-5 md:pt-0 pb-12">
        {/* Left Section - Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5 text-center md:text-left items-center md:items-start z-10 md:w-1/2"
        >
          <motion.div variants={itemVariants}>
            <span className="bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Welcome to Fork & Flame
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tighter"
          >
            A Taste of Exquisite
            <span className={`block ${primaryColor}`}>Modern Cuisine</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-gray-600 max-w-lg text-lg leading-relaxed"
          >
            Experience the best dining with our curated menu and elegant
            atmosphere. Your next culinary adventure starts here.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex gap-4 flex-wrap justify-center md:justify-start pt-2"
          >
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-7 py-3 text-white font-semibold ${primaryBg} rounded-lg shadow-md transition-all duration-300 flex items-center gap-1.5`}
              >
                Order Now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-7 py-3 text-gray-700 font-semibold bg-white border border-gray-300 rounded-lg transition-all duration-300 hover:border-green-600 hover:text-green-600"
              >
                View Menu
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex gap-8 items-center text-gray-600 text-sm mt-4 pt-4 border-t border-gray-100"
          >
            <div className="flex items-center gap-2">
              <Star className={`w-5 h-5 ${accentColor} fill-amber-500`} />
              <span>
                <strong className="text-gray-900">4.9</strong> Rating
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className={`w-5 h-5 ${primaryColor}`} />
              <span>
                <strong className="text-gray-900">100+</strong> Dishes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className={`w-5 h-5 ${primaryColor}`} />
              <span>
                <strong className="text-gray-900">10k+</strong> Customers
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Section Scroll-based rotation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="relative md:w-1/2 flex items-center justify-center z-10 mt-12 md:mt-0"
        >
          {/* Main Image with scroll-based rotation */}
          <motion.img
            src={banner}
            alt="Delicious Food"
            className="w-full max-w-sm md:max-w-md h-auto object-cover "
            style={{
              aspectRatio: "1/1",
              rotate: rotate,
            }}
          />
        </motion.div>
      </section>

      {/*  Menu Categories Section */}

      <hr className="max-w-7xl mx-auto border-gray-100" />
      <section className="py-20 px-6 md:px-20 bg-gray-50">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`text-center text-3xl md:text-4xl font-bold ${primaryColor} mb-14`}
        >
          Explore Our Diverse Menu Categories
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            {
              title: "Variety Biriyanis",
              img: "https://imgs.search.brave.com/PRO9fa1IkrD7RduzNcSn4HQpAmt9Badi1Qqi_Ah8crI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA5LzAzLzE2LzM0/LzM2MF9GXzkwMzE2/MzQ1Ml82TW9YMWNr/OW5BMkxiUGFZS0NK/dnBHNGNLSWs4Q0c0/Mi5qcGc",
            },
            {
              title: "Chinese",
              img: "https://imgs.search.brave.com/DMl3aXCvXdTPB9Huk0y859FgiH5AB2uj6dMk3WA7548/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NzE4MDUzNDEzMDIt/Zjg1NzMwODY5MGUz/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjEuMCZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE9IeDhaR2x6/YUh4bGJud3dmSHd3/Zkh4OE1BPT0",
            },
            {
              title: "Arabic",
              img: "https://imgs.search.brave.com/3ROw6Q4XUUTDCmdNi9iL4_G-HAlEpRNA8SLPTiCK_J0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by92aWJyYW50LXNw/cmVhZC12YXJpb3Vz/LWRpc2hlcy1zaG93/Y2FzaW5nLXJpY2gt/Y3VsaW5hcnktY3Vs/dHVyZV83MzY5ODAt/MjUyNi5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQw",
            },
            {
              title: "Beverages",
              img: "https://imgs.search.brave.com/UBmPJkNXDxg3miFdv6ysyqcQhppuMFaM-XU0rYQOEyY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9jb2xkLXN1bW1l/ci1jb2NrdGFpbHMt/ZHJpbmtzLWNsYXNz/aWMtYWxjb2hvbGlj/LWxvbmctZHJpbmst/bW9qaXRvLW1vY2t0/YWlsLWhpZ2hiYWxs/cy13aXRoLWJsdWVi/ZXJyaWVzLWJsYWNr/YmVycmllcy1yYXNw/YmVycmllcy1saW1l/LWhlcmJzLWljZS1i/bHVlLWJhY2tncm91/bmRfNjMwMjA3LTE0/NDYuanBnP3NlbXQ9/YWlzX2h5YnJpZCZ3/PTc0MA",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
              className="rounded-lg shadow-sm overflow-hidden bg-white border border-gray-100 cursor-pointer"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-48 object-cover hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg text-gray-800">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link to="/menu">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center rounded-lg px-8 py-3 ${primaryBg} text-white text-md font-semibold shadow-lg transition-all ${primaryHoverBg}`}
            >
              View Full Menu
              <List className="ml-2 w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </section>

      {/*  About Section */}

      <hr className="max-w-7xl mx-auto border-gray-100" />
      <section className="py-20 px-6 md:px-20 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`text-center text-3xl md:text-4xl font-bold ${primaryColor} mb-14`}
        >
          ABOUT US
        </motion.h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/2 order-2 md:order-1"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              The Fork & Flame Story
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 border-l-4 border-amber-500 pl-4">
              At
              <span className={`font-semibold ${primaryColor}`}>
                Fork & Flame
              </span>
              , we believe dining is an art form. Our mission is to transform a
              simple meal into an immersive, unforgettable experience.. that
              delights every sense.
              <br />
              <br />
              We specialize in Modern Cuisine — blending classic techniques
              with contemporary innovation. Each dish reflects the seasons,
              built with sustainably sourced ingredients of the highest quality.
              We prioritize elegance, fresh flavors, and impeccable service.
            </p>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#065f46" }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 ${primaryBg} text-white rounded-lg shadow-md transition`}
              >
                Read More About Us
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/3 order-1 md:order-2"
          >
            <img
              src={aboutImg}
              alt="Fork and Flame Logo"
              className="rounded-lg shadow-xl border border-gray-100 transform transition-transform duration-500"
            />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
