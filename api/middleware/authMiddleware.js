import jwt from 'jsonwebtoken'
import { createError } from '../configs/errorConfig.js'
import { User } from '../models/index.js'
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId

export const verifyTokens = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth) return next(createError(400, 'Tokens not provided'))
  const token = auth.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, async (err, user) => {
    if (err) return next(createError(401, err?.message || 'Token expired'))
    const userData = await User.findById(new ObjectId(user._id))
    if (userData) {
      req.user = userData
    } else { 
      return next(createError(401, 'Invalid token'))
    }
    next()
  })
}

export const verifyRefreshTokens = (req, res, next) => {
  const token = req.body.refresh_token
  if (!token) return next(createError(400, 'Tokens not provided'))
  jwt.verify(token, process.env.REFRESH_TOKEN_KEY, async (err, user) => {
    if (err) return next(createError(401, err?.message || 'Token expired'))
    const userData = await User.findById(new ObjectId(user._id))
    if (userData) {
      req.user = userData
    } else {
      return next(createError(401, 'Invalid token'))
    }
    next()
  })
}

export const verifyOTPTokens = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth) return next(createError(400, 'Tokens not provided'))
  const token = auth.split(' ')[1]
  jwt.verify(token, process.env.OTP_TOKEN_KEY, async (err, user) => {
    if (err) return next(createError(401, err?.message || 'Token expired'))
    const userData = await User.findById(new ObjectId(user._id))
    if (userData) {
      req.user = userData
    } else {
      return next(createError(401, 'Invalid token'))
    }
    next()
  })
}

export const verifyAdmin = (req, res, next) => {
  verifyTokens(req, res, () => {
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      next()
    } else {
      return next(createError(401, 'Not authorised to do this action'))
    }
  })
}
