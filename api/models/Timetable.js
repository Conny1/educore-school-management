import mongoose from 'mongoose'

const TimetableSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  gradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  subject: { type: String, required: true },
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, default: '' },
  is_deleted:{type:Boolean, default:true}
}, { timestamps: true })

const Timetable = mongoose.model('Timetable', TimetableSchema)
export default Timetable
