import mongoose from 'mongoose'

const GradeSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name: { type: String, required: true },
  stream: { type: String, default: '' },
  level: { type: String, required: true },
  classTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
  is_deleted:{type:Boolean, default:false}
}, { timestamps: true })

const Grade = mongoose.model('Grade', GradeSchema)
export default Grade
