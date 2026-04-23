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

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB for seeding...')

    // Optional: Clear existing data
    // await mongoose.connection.dropDatabase();

    // 1. Create School
    const schoolData = {
      name: 'Mshiriki Academy',
      county: 'Nairobi',
      level: 'primary',
      currentTerm: 'Term 2',
      currentYear: '2025'
    }
    const school = await School.create(schoolData)
    const schoolId = school._id
    console.log(`Created school: ${school.name}`)

    // 2. Create Departments
    const depts = [
      { name: 'Sciences', description: 'STEM education and research' },
      { name: 'Humanities', description: 'Languages, history and social studies' },
      { name: 'Administration', description: 'School leadership and logistics' }
    ]
    const createdDepts = await Department.insertMany(depts.map(d => ({ ...d, schoolId })))
    const deptMap = new Map()
    deptMap.set('dept-1', createdDepts[0]._id)
    deptMap.set('dept-2', createdDepts[1]._id)
    deptMap.set('dept-3', createdDepts[2]._id)

    // 3. Create Grades
    const gradesData = [
      { name: 'Grade 1', stream: 'North', level: 'Lower Primary' },
      { name: 'Grade 2', stream: 'North', level: 'Lower Primary' },
      { name: 'Grade 3', stream: 'South', level: 'Lower Primary' },
      { name: 'Grade 4', stream: 'North', level: 'Upper Primary' },
      { name: 'Grade 5', stream: 'East', level: 'Upper Primary' },
      { name: 'Grade 6', stream: 'West', level: 'Upper Primary' }
    ]
    const createdGrades = await Grade.insertMany(gradesData.map(g => ({ ...g, schoolId })))
    const gradeMap = new Map()
    createdGrades.forEach((g, i) => gradeMap.set(`grade-${i + 1}`, g._id))

    // 4. Create Employees
    const employeesData = [
      { staffNo: 'STF/001', firstName: 'Evans', lastName: 'Mutunga', role: 'teacher', phone: '0711000001', email: 'evans@school.com', hireDate: '2018-01-05', departmentId: deptMap.get('dept-1'), gradeId: gradeMap.get('grade-1') },
      { staffNo: 'STF/002', firstName: 'Florence', lastName: 'Awuor', role: 'teacher', phone: '0711000002', email: 'florence@school.com', hireDate: '2019-05-12', departmentId: deptMap.get('dept-1'), gradeId: gradeMap.get('grade-2') },
      { staffNo: 'STF/003', firstName: 'Geoffrey', lastName: 'Kiprotich', role: 'teacher', phone: '0711000003', email: 'geoffrey@school.com', hireDate: '2020-02-15', departmentId: deptMap.get('dept-2'), gradeId: gradeMap.get('grade-3') },
      { staffNo: 'ADM/001', firstName: 'Kennedy', lastName: 'Ouko', role: 'admin', phone: '0722000001', email: 'kennedy@school.com', hireDate: '2015-10-10', departmentId: deptMap.get('dept-3') }
    ]
    const createdEmployees = await Employee.insertMany(employeesData.map(e => ({ ...e, schoolId })))
    const empMap = new Map()
    empMap.set('emp-1', createdEmployees[0]._id)
    empMap.set('emp-2', createdEmployees[1]._id)
    empMap.set('emp-3', createdEmployees[2]._id)
    empMap.set('emp-adm-1', createdEmployees[3]._id)

    // Update grades with class teachers
    await Promise.all([
      Grade.findByIdAndUpdate(gradeMap.get('grade-1'), { classTeacherId: empMap.get('emp-1') }),
      Grade.findByIdAndUpdate(gradeMap.get('grade-2'), { classTeacherId: empMap.get('emp-2') }),
      Grade.findByIdAndUpdate(gradeMap.get('grade-3'), { classTeacherId: empMap.get('emp-3') })
    ])

    // 5. Create Students
    const studentsData = [
      { gradeId: gradeMap.get('grade-4'), admissionNo: 'ADM/2022/001', firstName: 'Kamau', lastName: 'Mwangi', dob: '2014-05-12', gender: 'male', guardianName: 'John Mwangi', guardianPhone: '0712345678', enrolledAt: '2022-01-10' },
      { gradeId: gradeMap.get('grade-4'), admissionNo: 'ADM/2022/002', firstName: 'Zainabu', lastName: 'Abdullah', dob: '2014-08-20', gender: 'female', guardianName: 'Abdullah Omar', guardianPhone: '0722334455', enrolledAt: '2022-01-11' },
      { gradeId: gradeMap.get('grade-3'), admissionNo: 'ADM/2023/005', firstName: 'Kipchumba', lastName: 'Rotich', dob: '2015-02-15', gender: 'male', guardianName: 'Mary Rotich', guardianPhone: '0733445566', enrolledAt: '2023-01-15' }
    ]
    const createdStudents = await Student.insertMany(studentsData.map(s => ({ ...s, schoolId })))
    const studentMap = new Map()
    studentMap.set('std-1', createdStudents[0]._id)
    studentMap.set('std-2', createdStudents[1]._id)
    studentMap.set('std-3', createdStudents[2]._id)

    // 6. Create Super Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await User.create({
      schoolId,
      name: 'System Admin',
      email: 'joelconrad277@gmail.com', // From context
      password: hashedPassword,
      role: 'superadmin'
    })
    console.log('Super Admin user created: joelconrad277@gmail.com / admin123')

    // 7. Suppliers
    const suppliersData = [
        { name: 'Nairobi Stationery Ltd', contactPerson: 'Peter Kariuki', phone: '0700111222', email: 'peter@stationery.co.ke', category: 'Stationery' }
    ]
    const createdSuppliers = await Supplier.insertMany(suppliersData.map(s => ({ ...s, schoolId })))
    const supMap = new Map()
    supMap.set('sup-1', createdSuppliers[0]._id)

    // 8. Inventory
    const invData = [
        { supplierId: supMap.get('sup-1'), name: 'A4 Printing Paper', category: 'Stationery', quantity: 5, reorderLevel: 10, unitCost: 650, unit: 'reams', lastUpdated: '2025-04-10' }
    ]
    await InventoryItem.insertMany(invData.map(i => ({ ...i, schoolId })))

    console.log('Seeding completed successfully!')
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed:', err)
    process.exit(1)
  }
}

seed()
