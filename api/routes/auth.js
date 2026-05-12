import express from 'express'
const router = express.Router()
import * as authController from '../controllers/authController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { loginSchema } from '../validation/authValidation.js'
import { resetPassword } from '../services/authService.js'

router.post('/login', validate(loginSchema), authController.login)
router.get('/me', verifyTokens, authController.getMe)
router.post('/logout', verifyTokens, authController.logout)

router.post(
  "/reset-password",
  verifyTokens,  // remember to change to resetPassword tokens
  validate(resetPassword),
  authController.resetPassword
);

export default router
