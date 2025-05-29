import React from "react";
import AppName from "./../data/AppName";
import logo from "../assets/logo.jpg";

export default function Footer() {
  return (
    <>
      <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <img
                  src={logo}
                  alt="School Logo"
                  className="h-8 w-8 mr-2 rounded-full"
                />
                <AppName />
              </h3>
              <p className="text-gray-300 font-styled text-sm">
                Shaping the future with world-class education.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {["Home", "About", "Courses", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="hover:text-yellow-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
              <p className="text-gray-300">Ukunda Town, Kwale County</p>
              <p className="text-gray-300">Email: ukundayp@gmail.com</p>
              <p className="text-gray-300">Phone: +(254) 05075170</p>
              {/* <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-yellow-400">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                   
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-yellow-400">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103v3.333h-2.073c-1.951 0-2.584.915-2.584 2.453v1.669h4.518l-.701 3.667h-3.817v7.98h-2.669z" />
                  </svg>
                </a>
              </div> */}
            </div>
          </div>
          <div className="mt-8 text-center font-styled text-gray-400">
            © {new Date().getFullYear()} <AppName/>. All rights
            reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
