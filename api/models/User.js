import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin', 'teacher', 'finance'], required: true }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)
export default User
