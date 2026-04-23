import express from 'express'
const router = express.Router()
import * as timetableController from '../controllers/timetableController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createTimetableSchema } from '../validation/timetableValidation.js'

router.use(verifyTokens)
router.get('/', timetableController.getTimetable)
router.post('/', validate(createTimetableSchema), timetableController.createTimetableEntry)
router.put('/:id', timetableController.updateTimetableEntry)
router.delete('/:id', timetableController.deleteTimetableEntry)

export default router
