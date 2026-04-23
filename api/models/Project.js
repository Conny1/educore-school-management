import mongoose from 'mongoose'
import paginate from "./plugins/paginatePlugins.js"

const ProjectSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  budget: { type: Number, required: true },
  status: { type: String, enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'], default: 'planning' },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  managedBy: { type: String,  required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  is_deleted:{type:Boolean, default:false}

}, { timestamps: true })
   
ProjectSchema.plugin(paginate);

const Project = mongoose.model('Project', ProjectSchema)
export default Project
