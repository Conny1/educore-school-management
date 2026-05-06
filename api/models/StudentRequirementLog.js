import mongoose from 'mongoose'

const StudentRequirementLogSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  requirementId: { type: mongoose.Schema.Types.ObjectId, ref: 'GradeRequirement', required: true },
  qtyBrought: { type: Number, required: true },
  dateRecorded: { type: String, required: true },
  remarks: { type: String, default: '' },
  recordedBy: { type: String, required: true },
  is_deleted:{type:Boolean, default:false}
}, { timestamps: true })

const StudentRequirementLog = mongoose.model('StudentRequirementLog', StudentRequirementLogSchema)
export default StudentRequirementLog
