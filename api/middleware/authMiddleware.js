import jwt from "jsonwebtoken";
import { createError } from "../configs/errorConfig.js";
import { User } from "../models/index.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const verifyTokens = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return next(createError(400, "Tokens not provided"));
  const token = auth.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, async (err, user) => {
    if (err) return next(createError(401, err?.message || "Token expired"));
    const userData = await User.findById(new ObjectId(user._id));
    if (userData) {
      req.user = userData;
    } else {
      return next(createError(401, "Invalid token"));
    }
    next();
  });
};

export const verifyRefreshTokens = (req, res, next) => {
  const token = req.body.refresh_token;
  if (!token) return next(createError(400, "Tokens not provided"));
  jwt.verify(token, process.env.REFRESH_TOKEN_KEY, async (err, user) => {
    if (err) return next(createError(401, err?.message || "Token expired"));
    const userData = await User.findById(new ObjectId(user._id));
    if (userData) {
      req.user = userData;
    } else {
      return next(createError(401, "Invalid token"));
    }
    next();
  });
};

export const verifyOTPTokens = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return next(createError(400, "Tokens not provided"));
  const token = auth.split(" ")[1];
  jwt.verify(token, process.env.OTP_TOKEN_KEY, async (err, user) => {
    if (err) return next(createError(401, err?.message || "Token expired"));
    const userData = await User.findById(new ObjectId(user._id));
    if (userData) {
      req.user = userData;
    } else {
      return next(createError(401, "Invalid token"));
    }
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyTokens(req, res, () => {
    if (req.user.role === "admin" || req.user.role === "superadmin") {
      next();
    } else {
      return next(createError(401, "Not authorised to do this action"));
    }
  });
};

const accessRules = {
  superadmin: {
    // Superadmin has access to everything by default
    access_routes: ["*"],
  },
  admin: {
    access_routes: [
      "departments",
      "grades",
      "grade-requirements",
      "students",
      "employees",
      "requirement-logs",
      "employee-attendance",
      "student-attendance",
      "timetable",
      "school",
      "users",
    ],
  },
  teacher: {
    access_routes: [
      "students",
      "student-attendance",
      "timetable",
      "grades",
    ],
  },
  finance: {
    access_routes: [
      "grade-fees",
      "payments",
      "suppliers",
      "expenses",
      "inventory",
      "reports",
      "projects",
    ],
  },
  management: {
    access_routes: [
      "students",
      "employees",
      "employee-attendance",
      "student-attendance",
      "reports",
      "projects",
      "school",
      "departments",
    ],
  },
};

export const checkAccess = (req, res, next) => {
  const userRole = req.user.role;
  const currentPath = req.baseUrl.split("/api/")[1];

  const rules = accessRules[userRole]?.access_routes || [];

  if (rules.includes("*") || rules.includes(currentPath)) {
    return next();
  }

  return res.status(403).json({ message: "Access Denied" });
};
