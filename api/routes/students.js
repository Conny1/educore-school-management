import express from 'express'
const router = express.Router()
import * as studentController from '../controllers/studentController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createStudentSchema, updateStudentSchema } from '../validation/studentValidation.js'

router.use(verifyTokens)

router.get('/', studentController.getStudents)
router.get('/:id', studentController.getStudentById)
router.post('/', validate(createStudentSchema), studentController.createStudent)
router.put('/:id', validate(updateStudentSchema), studentController.updateStudent)
router.delete('/:id', studentController.deleteStudent)

export default router
