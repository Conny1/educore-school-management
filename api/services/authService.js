import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { createError } from '../configs/errorConfig.js'

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) throw createError(401, 'Invalid credentials')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw createError(401, 'Invalid credentials')
console.log(process.env.ACCESS_TOKEN_KEY)
  // schoolId is embedded in the token payload
  const accessToken = jwt.sign(
    { _id: user._id, schoolId: user.schoolId, role: user.role },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: '1d' }
  )

  const refreshToken = jwt.sign(
    { _id: user._id, schoolId: user.schoolId },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: '7d' }
  )

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId
    }
  }
}

export const getMe = async (userId) => {
  return await User.findById(userId).select('-password')
}
