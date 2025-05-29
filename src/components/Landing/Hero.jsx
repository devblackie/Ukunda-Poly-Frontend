import React, { use } from "react";
import AppName from "../../data/AppName";
import { motion } from "framer-motion";
import { Parallax } from "react-parallax";
import EnrollNowButton from "../ui/ButtonComponents";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleEnrollNowClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <Parallax strength={300} className="relative h-[700px] fle items-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-[700px] object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/5940677/5940677-sd_640_360_25fps.mp4" // Replace with your video URL or local path (e.g., src/assets/videos/hero-video.mp4)
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 h-[700px] bg-black/60"></div>

        <div className="container  mx-auto px-4 pt-52 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Excellence in Education
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto"
          >
            Join <AppName /> to unlock a world of opportunities.
          </motion.p>
     
          <EnrollNowButton onClick={handleEnrollNowClick} />
        </div>
      </Parallax>
    </div>
  );
}
