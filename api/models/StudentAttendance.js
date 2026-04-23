import mongoose from 'mongoose'

const StudentAttendanceSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  gradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
  remarks: { type: String, default: '' },
  recordedBy: { type: String, required: true }
}, { timestamps: true })

const StudentAttendance = mongoose.model('StudentAttendance', StudentAttendanceSchema)
export default StudentAttendance
