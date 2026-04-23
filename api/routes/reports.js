import express from 'express'
const router = express.Router()
import * as reportController from '../controllers/reportController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'

router.use(verifyTokens)

router.get('/fees', reportController.getFeeCollectionReport)
router.get('/attendance', reportController.getAttendanceReport)
router.get('/expenses', reportController.getExpenseReport)
router.get('/requirements', reportController.getRequirementReport)

export default router
