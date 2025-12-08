import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthPage from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AluminiDashboard";
import AdminDashboard from "./pages/AdminDashboard";
/*
  App.jsx - token-based auth (localStorage token)
  - Adds AlumniDashboard with:
      - fetch user: POST /api/v1/getUser   (body { token })
      - update profile: POST /api/v1/update-alumini-profile (body includes token + profile fields)
      - create job post: POST /api/v1/create-post (body includes token + post data)
  - Protected route for Alumni at /alumni/dashboard
  - All authenticated requests send:
      Authorization: Bearer <token>
      body: { token, ... }
*/

const API_BASE = "http://localhost:4000/api/v1";


/* ----------------------- Admin Dashboard (placeholder) ----------------------- */


/* ----------------------- ProtectedRoute ----------------------- */
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/auth" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/auth" replace />;

  return children;
}

/* ----------------------- App (router) ----------------------- */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["Student"]}><StudentDashboard /></ProtectedRoute>} />

        <Route path="/alumni/dashboard" element={<ProtectedRoute allowedRoles={["Alumni"]}><AlumniDashboard /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminDashboard /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
