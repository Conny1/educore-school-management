import mongoose from 'mongoose'

const EmployeeSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  gradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
  staffNo: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'admin', 'support', 'management', 'finance'], required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  hireDate: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive', 'on_leave'], default: 'active' },
  is_deleted:{type:Boolean, default:true}
}, { timestamps: true })

EmployeeSchema.index({ schoolId: 1, staffNo: 1 }, { unique: true })
EmployeeSchema.index({ schoolId: 1, email: 1 }, { unique: true })

const Employee = mongoose.model('Employee', EmployeeSchema)
export default Employee
