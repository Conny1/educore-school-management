import express from 'express'
const router = express.Router()
import * as authController from '../controllers/authController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { loginSchema } from '../validation/authValidation.js'

router.post('/login', validate(loginSchema), authController.login)
router.get('/me', verifyTokens, authController.getMe)
router.post('/logout', verifyTokens, authController.logout)

export default router
