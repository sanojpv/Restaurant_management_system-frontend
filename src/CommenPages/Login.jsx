
import { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/forkandflame-logo.png";
import api from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await api.post(`/${role}/login`, { email, password });
    const { token, staff, admin, customer } = res.data;

    const user = staff || admin || customer;
    if (!token || !user) throw new Error("Invalid response");
console.log(user);

console.log(user._id);

    //  ensure savedRole exists
    const savedRole = user.role || role;

    // Save data to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", savedRole);
    localStorage.setItem("id", user._id);
  
    
    localStorage.setItem("user", JSON.stringify(user));

    //  Redirect based on role
    if (savedRole === "admin") navigate("/admin");
    else if (savedRole === "staff") navigate("/staff");
    else navigate("/");
  } catch (err) {
    console.error("Login error:", err);
    setError(err.response?.data?.message || "Login failed. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left image */}
        <div className="hidden md:flex items-center justify-center bg-gray-50">
          <img src={logo} alt="Fork & Flame" className="w-fit h-full object-contain" />
        </div>

        {/* Right form */}
        <div className="p-6 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-emerald-800 mb-2 text-center md:text-left">
            Welcome Back
          </h2>
          <p className="text-center md:text-left text-gray-500 mb-6 text-sm">
            Login to your Fork & Flame account
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-emerald-700"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
                aria-label="Select role"
              >
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-400" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white text-sm shadow-md transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-700 hover:bg-emerald-800"
              }`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center md:text-left text-gray-500 mt-6 text-sm">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-emerald-700 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
