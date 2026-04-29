import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import {ToastContainer} from  "react-toastify"

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Grades from "./pages/Grades";
import Employees from "./pages/Employees";
import Timetable from "./pages/Timetable";
import Attendance from "./pages/Attendance";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import Projects from "./pages/Projects";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import StudentProfile from "./pages/StudentProfile";

export default function App() {
  return (
    <BrowserRouter>
  <ToastContainer/>
      <Routes>
        <Route path="/login" element={<Login/>} />
      </Routes>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
                    <Route path="/students/:id" element={<StudentProfile/>} />

          <Route path="/grades" element={<Grades />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/reports" element={<Reports />} />

          {/* fallback */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
