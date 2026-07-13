import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthProvider from "./pages/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StudentResults from "./pages/StudentResults";
import StudentLeave from "./pages/StudentLeave";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Results from "./pages/Results";
import StudentProfile from "./pages/StudentProfile";
import LowAttendance from "./pages/LowAttendance";
import LeaveManagement from "./pages/LeaveManagement";

import Layout from "./layouts/Layout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />

          <Route path="/my-results" element={
            <ProtectedRoute roles={["student"]}><StudentResults /></ProtectedRoute>
          } />
          <Route path="/my-leave" element={
            <ProtectedRoute roles={["student"]}><StudentLeave /></ProtectedRoute>
          } />

          <Route element={
            <ProtectedRoute roles={["admin"]}><Layout /></ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/staff" element={
            <ProtectedRoute roles={["staff"]}><Layout /></ProtectedRoute>
          }>
            <Route index element={<StaffDashboard />} />
          </Route>

          <Route element={
            <ProtectedRoute roles={["admin", "staff"]}><Layout /></ProtectedRoute>
          }>
            <Route path="/students" element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/results" element={<Results />} />
            <Route path="/student/:id" element={<StudentProfile />} />
            <Route path="/low-attendance" element={<LowAttendance />} />
            <Route path="/leave-management" element={<LeaveManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
