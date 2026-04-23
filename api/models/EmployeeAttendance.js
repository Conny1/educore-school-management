import mongoose from 'mongoose'

const EmployeeAttendanceSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'on_leave', 'half_day'], required: true },
  checkIn: { type: String, default: null },
  checkOut: { type: String, default: null },
  remarks: { type: String, default: '' },
  recordedBy: { type: String, required: true }
}, { timestamps: true })

const EmployeeAttendance = mongoose.model('EmployeeAttendance', EmployeeAttendanceSchema)
export default EmployeeAttendance
