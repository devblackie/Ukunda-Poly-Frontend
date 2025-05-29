import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoginIllustration from "../assets/illustration/LoginIllustration.svg"; // Adjust the path as necessary
import StudyingIllustration from "../assets/illustration/StudyingIllustration.svg"; // Adjust the path as necessary
import AppName from "../data/AppName";
import BASE_API_URL from "../config/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_API_URL}/api/login`,
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      const { role } = response.data.user;
      if (role === "educator") {
        navigate("/educator");
      } else if (role === "student") {
        navigate("/student");
      } else if (role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
      <img
        src={StudyingIllustration}
        alt="Studying Illustration"
        className="absolute bottom-0 right-0 h-1/2 opacity-85 object-contain"
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        // className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md z-10"
        className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Image Section */}
        <div className="relative hidden md:block">
          <img

            src="https://images.unsplash.com/photo-1622555063306-9930f396f051?w=500&auto=format&fit=crop&q=60&ixlib=rb-2.0.3"
            alt="Students Studying"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = StudyingIllustration; // Fallback to local SVG
            }}
          />
          <div className="absolute inset-0 bg-blue-900/30"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl text-gray-50 font-semibold"><AppName /></h3>
            <p className="text-sm opacity-80">
              Empowering Minds, Shaping Futures
            </p>
          </div>
        </div>
        {/* Form Section */}
        <div className="p-8 flex flex-col justify-center relative">
          <img
            src={LoginIllustration}
            alt="Studying Illustration"
            className="absolute top-0 right-0 h-24 opacity-50 object-contain"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
            }}
          />
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
              alt="School Logo"
              className="h-10 w-10 rounded-full mb-2"
            />
            <h2 className="text-2xl font-bold text-blue-900  tracking-tight">
              <AppName />
            </h2>
            <p className="text-gray-600 text-sm mt-1 font-styled">
              eLearning Portal
            </p>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mb-4 text-center text-sm bg-red-100/50 p-2 rounded"
            >
              {error}
            </motion.p>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block text-blue-800 font-medium mb-1.5">
                Email Address
              </label>
              <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                required
                placeholder="your.email@example.com"
              />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-blue-800 font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                required
                placeholder="••••••••"
              />

              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
                stroke="currentColor"
              >
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
              </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-yellow-400"
                >
                  {showPassword ? (
                       <svg
                       xmlns="http://www.w3.org/2000/svg"
                       height="24px"
                       viewBox="0 -960 960 960"
                       width="24px"
                       fill="#44403b"
                     >
                       <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                     </svg>
                  ) : (
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#44403b"
                  >
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                  </svg>
                  )}
                </button>
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full bg-yellow-400 text-blue-900 p-3 rounded-lg font-semibold transition-all ${
                isLoading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-yellow-300"
              } shadow-lg hover:shadow-xl`}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>
          <p className="text-center text-gray-600 text-sm mt-5">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-yellow-400 hover:underline font-medium"
            >
              Sign Up
            </a>
          </p>
        </div>
        {/* Form ends */}
      
      </motion.div>
    </div>
  );
}
