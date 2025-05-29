// src/components/ButtonComponents.js
import React from "react";
import { motion } from "framer-motion";

const EnrollNowButton = ({onClick}) => {
  return (
    <button
      onClick={onClick}
      className=" cursor-pointer group relative select-none  bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-full py-3 px-6 text-center align-middle font-sans text-xs font-semibold uppercase text-black shadow-md shadow-yellow-500/20 transition-all duration-200 ease-in-out hover:shadow-lg hover:shadow-yellow-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
    >
      <div className="relative flex items-center justify-center gap-2">
        <span className="relative inline-block overflow-hidden">
          <span className="block transition-transform duration-300 group-hover:-translate-y-full">
            Get Started
          </span>
          <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
            Right Now
          </span>
        </span>
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45"
          viewBox="0 0 24 24"
        >
          <circle fill="currentColor" r={11} cy={12} cx={12} />
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth={2}
            stroke="white"
            d="M7.5 16.5L16.5 7.5M16.5 7.5H10.5M16.5 7.5V13.5"
          />
        </svg>
      </div>
    </button>
  );
};

export default EnrollNowButton;

export const FilterButton = ({
  onClick,
  isActive,
  children,
  svg,
  className = "",
  ...props
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center text-sm font-medium px-4 py-1  rounded-lg transition ${
      isActive
        ? "bg-gray-400 shadow-md shadow-gray-700 text-blue-900 border-b"
        : "bg-white shadow-md shadow-gray-700 text-gray-700 hover:bg-gray-100"
    } ${className}`}
    aria-pressed={isActive}
    {...props}
  >
    {svg}
    {children}
  </motion.button>
);

export const ShowMoreButton = ({
  onClick,
  children = "Show More",
  className = "",
  ...props
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={` text-xs flex items-center ${className}`}
    {...props}
  >
    {children}
    <svg
      className="ml-1 h-3 w-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  </motion.button>
);
export const EditButton = ({
  onClick,
  children = "Edit",
  className = "",
  ...props
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`text-xs flex items-center  ${className}`}
    {...props}
  >
    {children}
    <svg
      className="ml-1 h-3 w-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828l-2.828.586.586-2.828L16.414 6.586z"
      />
    </svg>
  </motion.button>
);

export const AddButton = ({
  onClick,
  children = "Add",
  className = "",
  ...props
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`text-xs flex items-center text-blue-900 bg-yellow-400 p-2 px-3 font-semibold rounded-full shadow-md shadow-gray-700 ${className}`}
    {...props}
  >
    <svg
      className="mr-1 h-3 w-3"
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
    {children}
  </motion.button>
);

export const ToggleButton = ({
  onClick,
  children = "Menu",
  className = "",
  ...props
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg ${className}`}
    {...props}
  >
    <svg
      className="h-5 w-5 mr-2 text-white"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
    {children}
  </motion.button>
);
