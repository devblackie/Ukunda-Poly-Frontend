import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoginIllustration from "../assets/illustration/LoginIllustration.svg"; // Adjust the path as necessary
import StudyingIllustration from "../assets/illustration/StudyingIllustration.svg"; // Adjust the path as necessary
import AppName from "../data/AppName";
import BASE_API_URL from "../config/config";
import logo from "../assets/logo.jpg"; // Adjust the path as necessary

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
              src={logo}
              alt="School Logo"
              className="h-16 w-16 rounded-full mb-2"
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
            {/* Email Input */}
               <div className="relative mb-5 h-11 w-full min-w-[200px]">
              <input
                    type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=""
                className="peer   h-full w-full rounded-md border border-gray-400 border-t-transparent bg-transparent px-3 py-3  text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-cyan-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              />
              <label className="before:content[' '] after:content[' pointer-events-none absolute left-0 -top-1.5  flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-cyan-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-cyan-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-cyan-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-gray-500">
                Email
              </label>
            </div>
            {/* Password Input */}
              <div className="relative mb-5 h-11 w-full min-w-[200px]">
              <input
                   type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=""
                className="peer   h-full w-full rounded-md border border-gray-400 border-t-transparent bg-transparent px-3 py-3  text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-cyan-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              />
              <label className="before:content[' '] after:content[' pointer-events-none absolute left-0 -top-1.5  flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-cyan-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-cyan-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-cyan-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-gray-500">
                Password
              </label>
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
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`block w-full select-none rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-cyan-500/20 transition-all hover:shadow-lg hover:shadow-cyan-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${

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
              className="text-cyan-500 hover:underline font-medium"
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
