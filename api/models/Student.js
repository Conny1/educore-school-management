import mongoose from 'mongoose'

const StudentSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  gradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  admissionNo: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  guardianName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  status: { type: String, enum: ['active', 'suspended', 'transferred', 'graduated'], default: 'active' },
  enrolledAt: { type: String, required: true },
  id_deleted:{type:Boolean, default:false}
}, { timestamps: true })

// Uniqueness per school
StudentSchema.index({ schoolId: 1, admissionNo: 1 }, { unique: true })

const Student = mongoose.model('Student', StudentSchema)
export default Student
