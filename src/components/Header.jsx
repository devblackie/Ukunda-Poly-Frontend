import React, { useEffect, useState } from "react";
import AppName from "../data/AppName";
import logo from "../assets/logo.png"; // Adjust the path as necessary
import { motion } from "framer-motion";
import NavigationData from "../data/NavigationData";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_API_URL from "../config/config";


export default function Header() {
  const location = useLocation();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [user, setUser] = useState({ name: "", role: "" });
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate(); 

  useEffect(() => {
    // console.log('Header useEffect running'); // Debug
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      // console.log('Token on load:', token); // Debug
      if (token) {
        try {
          // console.log('Fetching /api/auth/me'); // Debug
          const response = await axios.get(`${BASE_API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // console.log('API Response:', response.data); // Debug
          setUser(response.data.user );
          // setIsAuthenticated(true);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          localStorage.removeItem("token");
           setUser(null);
           navigate("/");
          // setIsAuthenticated(false);
        }
      } else {
        // console.log('No token found'); // Debug
        setUser(null);
        // setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [navigate]);
  // console.log('Rendering Header, user:', user); // Debug

  const handleLogout = () => {
    localStorage.removeItem("token");
    // setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };
  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 bg-blue-900/70 backdrop-blur-lg text-white shadow-xl z-50"
      >
        
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/">
            <h1 className="text-md text-gray-200 font-bold tracking-tight">
              <img
                src={logo}
                alt="School Logo"
                className="inline-block h-7 w-7 mr-2 rounded-full"
              />
              <AppName />
            </h1>
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <div className="font-styled flex items-baseline-last">
                <span className="font-medium text-yellow-300 text-sm capitalize">{user.name}</span>
                <span className="ml-2 text capitalize text-gray-50 text-xs">
                  ({user.role})
                </span>
              </div>
              <div className="relative">
              <motion.button
                onClick={handleLogout}
          
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-1 py-1 bg-yellow-400 text-blue-900 hover:text-gray-700 rounded-lg  hover:bg-blue-300 transition shadow-lg"
              >
                <svg
                className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                </svg>
                
              </motion.button>
              
            
              
              </div>
            </div>
          ) : (
            <nav className="space-x-6 flex">
              {NavigationData.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <a key={item} className="py-5 ">
                    <Link
                      to={item.path}
                      className={`flex items-center gap-1 px-2  rounded-lg transition-all duration-300  ${
                        isActive
                          ? "underline underline-offset-2  decoration-2 decoration-yellow-400 "
                          : ""
                      }`}
                    >
                      <span className="text-sm  font-styled  font-medium text-gray-200 hover:text-yellow-400 transition-colors duration-200">
                        {item.display}
                      </span>
                    </Link>
                  </a>
                );
              })}
            </nav>
          )}
        </div>
      </motion.header>
    </>
  );
}


