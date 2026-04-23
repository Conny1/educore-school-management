import express from 'express'
const router = express.Router()
import * as studentAttendanceController from '../controllers/studentAttendanceController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { recordAttendanceSchema, bulkAttendanceSchema } from '../validation/attendanceValidation.js'

router.use(verifyTokens)
router.get('/', studentAttendanceController.getStudentAttendance)
router.post('/', validate(recordAttendanceSchema), studentAttendanceController.recordStudentAttendance)
router.post('/bulk', validate(bulkAttendanceSchema), studentAttendanceController.bulkRecordStudentAttendance)

export default router
