import express from 'express'
const router = express.Router()
import * as gradeController from '../controllers/gradeController.js'
import { checkAccess, verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createGradeSchema, updateGradeSchema } from '../validation/gradeValidation.js'
import { findandfilter } from '../validation/logisticsValidation.js'

router.use(verifyTokens)
router.use(checkAccess )


router.get('/', gradeController.getGrades)
router.get('/:id', gradeController.getGradeById)
router.post('/', validate(createGradeSchema), gradeController.createGrade)
router.put('/:id', validate(updateGradeSchema), gradeController.updateGrade)
router.delete('/:id', gradeController.deleteGrade)
router.post('/findandfilter', validate(findandfilter), gradeController.findandfilterGrade)


export default router
