import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SignupIllustration from "../assets/illustration/SignupIllustration.svg"; // Adjust the path as necessary
import BASE_API_URL from "../config/config";
import AppName from './../data/AppName';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "educator",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        `${BASE_API_URL}/api/register`,
        formData
      );
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Image Section */}
        <div className="relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Education Community"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = SignupIllustration;
            }}
          />
          <div className="absolute inset-0 bg-blue-900/30"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-semibold">Join BrightFuture</h3>
            <p className="text-sm opacity-80">Empower Your Learning Journey</p>
          </div>
        </div>
        {/* Form Section */}
        <div className="p-8 flex flex-col justify-center relative">
          <img
            src={SignupIllustration}
            alt="Signup Illustration"
            className="absolute top-0 right-0 h-24 opacity-10 object-contain"
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
            <h2 className="text-2xl font-bold text-blue-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Join <AppName /> eLearning
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
          <form onSubmit={handleRegister}>
            <div className="mb-5">
              <label className="block text-blue-800 font-medium mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 pl-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  required
                  placeholder="Enter your name"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                </svg>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-blue-800 font-medium mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
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
            <div className="mb-5">
              <label className="block text-blue-800 font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
            <div className="mb-6">
              <label className="block text-blue-800 font-medium mb-1.5">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full p-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              >
                <option value="educator">Educator</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
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
              {isLoading ? "Registering..." : "Register"}
            </motion.button>
          </form>
          <p className="text-center text-gray-600 text-sm mt-5">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-yellow-400 hover:underline font-medium"
            >
              Log in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
