import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Hero from "../components/Landing/Hero";
import Login from "../pages/Login";
import StudentPortal from "../pages/StudentPortal";
import EducatorDashboard from "../pages/EducatorDashboard";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Hero />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student" element={<StudentPortal />} />
      <Route path="/educator" element={<EducatorDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
