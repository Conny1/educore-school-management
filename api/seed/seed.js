import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import {
  School,
  User,
  Department,
  Grade,
  GradeFee,
  GradeRequirement,
  Student,
  Employee,
  Payment,
  StudentRequirementLog,
  EmployeeAttendance,
  StudentAttendance,
  Timetable,
  Supplier,
  Expense,
  InventoryItem,
  Project
} from '../models/index.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
  console.error('MONGO_URI not found in environment')
  process.exit(1)
}

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. Create the School
    const school = await School.create({
      name: 'Elroi Hillview School',
      currentTerm: 'Term 2',
      currentYear: '2026'
    });
    console.log("School created:", school._id);

    // 2. Hash Password and Create Superadmin
    const hashedPassword = await bcrypt.hash('admin@123', 12);
    
    await User.create({
      schoolId: school._id,
      name: 'System Admin',
      email: 'joelconrad277@gmail.com',
      password: hashedPassword,
      role: 'superadmin'
    });

    console.log("Superadmin created successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seedData();