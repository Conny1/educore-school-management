import express from 'express'
const router = express.Router()
import * as employeeAttendanceController from '../controllers/employeeAttendanceController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { recordAttendanceSchema, bulkAttendanceSchema } from '../validation/attendanceValidation.js'

router.use(verifyTokens)
router.get('/', employeeAttendanceController.getEmployeeAttendance)
router.post('/', validate(recordAttendanceSchema), employeeAttendanceController.recordEmployeeAttendance)
router.post('/bulk', validate(bulkAttendanceSchema), employeeAttendanceController.bulkRecordEmployeeAttendance)

export default router
