import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff,Sparkles ,Clock9,User} from "lucide-react";
import api from "../services/api";

const Signup = () => {
  const [popup, setPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  const navigate = useNavigate();

  const handlesignup = (e) => {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await api.post("customer/signup", customer);
      console.log(response);
      setPopup(true);
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        setPopup(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 relative overflow-hidden">
      {/*  Popup */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="bg-green-300 rounded-2xl shadow-xl p-8 text-center max-w-sm">
            <h2 className="text-2xl font-bold text-gray-800">✅ Success!</h2>
            <p className="text-gray-800 mt-2">Account created successfully 🎉</p>
          </div>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side */}
            <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                  Join the{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600">
                    Fork & Flame
                  </span>{" "}
                  Family
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover exquisite flavors and create unforgettable dining
                  experiences with us.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="text-white"/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Premium Dining
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Exceptional culinary experiences
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                 <Clock9 className="text-white"/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Easy Reservations
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Book your table effortlessly
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mx-4 lg:mx-0">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mb-4">
               <User className="text-white"/>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Create Account
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Join us for an amazing culinary journey
                  </p>
                </div>

                {/* Form Inputs */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      autoComplete="off"
                      onChange={handlesignup}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-green-400 focus:bg-white transition-all duration-300 outline-none placeholder-gray-400"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      onChange={handlesignup}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-green-400 focus:bg-white transition-all duration-300 outline-none placeholder-gray-400"
                    />

                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      onChange={handlesignup}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-green-400 focus:bg-white transition-all duration-300 outline-none placeholder-gray-400"
                    />

                    {/*  Password Field */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        onChange={handlesignup}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-green-400 focus:bg-white transition-all duration-300 outline-none placeholder-gray-400"
                      />
                      <button
                        type="button"
                        className="absolute right-5 top-4 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
                    onClick={handleSubmit}
                  >
                    Create Account
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center space-x-4 my-6">
                  <span className="h-px w-full bg-gray-200"></span>
                  <span className="text-gray-400 text-sm font-medium px-2">
                    OR
                  </span>
                  <span className="h-px w-full bg-gray-200"></span>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Signup;
