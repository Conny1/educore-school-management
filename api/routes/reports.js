import express from 'express'
const router = express.Router()
import * as reportController from '../controllers/reportController.js'
import { checkAccess, verifyTokens } from '../middleware/authMiddleware.js'

router.use(verifyTokens)
router.use(checkAccess )

router.get('/fees', reportController.getFeeCollectionReport)
router.get('/attendance', reportController.getAttendanceReport)
router.get('/expenses', reportController.getExpenseReport)
router.get('/requirements', reportController.getRequirementReport)
router.get('/dashboard', reportController.dashbardSummary)

export default router
