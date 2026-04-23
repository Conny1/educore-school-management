import * as authService from '../services/authService.js'

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id)
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

export const logout = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}
