import express from 'express'
const router = express.Router()
import * as departmentController from '../controllers/departmentController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createDepartmentSchema, updateDepartmentSchema } from '../validation/departmentValidation.js'

router.use(verifyTokens)

router.get('/', departmentController.getDepartments)
router.post('/', validate(createDepartmentSchema), departmentController.createDepartment)
router.put('/:id', validate(updateDepartmentSchema), departmentController.updateDepartment)
router.delete('/:id', departmentController.deleteDepartment)

export default router
