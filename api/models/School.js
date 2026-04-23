import mongoose from 'mongoose'

const SchoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  county: { type: String, required: true },
  level: { type: String, enum: ['primary', 'secondary', 'mixed'], required: true },
  currentTerm: { type: String, enum: ['Term 1', 'Term 2', 'Term 3'], required: true },
  currentYear: { type: String, required: true }
}, { timestamps: true })

const School = mongoose.model('School', SchoolSchema)
export default School
