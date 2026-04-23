import express from 'express'
const router = express.Router()
import * as gradeRequirementController from '../controllers/gradeRequirementController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createGradeRequirementSchema, updateGradeRequirementSchema } from '../validation/gradeRequirementValidation.js'

router.use(verifyTokens)

router.get('/', gradeRequirementController.getGradeRequirements)
router.post('/', validate(createGradeRequirementSchema), gradeRequirementController.createGradeRequirement)
router.put('/:id', validate(updateGradeRequirementSchema), gradeRequirementController.updateGradeRequirement)
router.delete('/:id', gradeRequirementController.deleteGradeRequirement)

export default router
