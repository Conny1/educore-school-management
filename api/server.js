import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan"

// Load environment variables
dotenv.config();

// Middleware
import errorHandler from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./routes/auth.js";
import departmentRoutes from "./routes/departments.js";
import gradeRoutes from "./routes/grades.js";
import gradeFeeRoutes from "./routes/gradeFees.js";
import gradeRequirementRoutes from "./routes/gradeRequirements.js";
import studentRoutes from "./routes/students.js";
import employeeRoutes from "./routes/employees.js";
import paymentRoutes from "./routes/payments.js";
import requirementLogRoutes from "./routes/requirementLogs.js";
import employeeAttendanceRoutes from "./routes/employeeAttendance.js";
import studentAttendanceRoutes from "./routes/studentAttendance.js";
import timetableRoutes from "./routes/timetable.js";
import supplierRoutes from "./routes/suppliers.js";
import expenseRoutes from "./routes/expenses.js";
import inventoryRoutes from "./routes/inventory.js";
import projectRoutes from "./routes/projects.js";
import reportRoutes from "./routes/reports.js";

async function startServer() {
  const app = express();
  const PORT = 8000;

  // DB Connection
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/school_mgmt";
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"))

  // API routes FIRST
  app.use("/api/auth", authRoutes);
  app.use("/api/departments", departmentRoutes); 
  app.use("/api/grades", gradeRoutes);
  app.use("/api/grade-fees", gradeFeeRoutes);
  app.use("/api/grade-requirements", gradeRequirementRoutes);
  app.use("/api/students", studentRoutes);
  app.use("/api/employees", employeeRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/requirement-logs", requirementLogRoutes);
  app.use("/api/employee-attendance", employeeAttendanceRoutes);
  app.use("/api/student-attendance", studentAttendanceRoutes);
  app.use("/api/timetable", timetableRoutes);
  app.use("/api/suppliers", supplierRoutes);
  app.use("/api/expenses", expenseRoutes);
  app.use("/api/inventory", inventoryRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/reports", reportRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Global Error Handler
  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
