import express from 'express'
const router = express.Router()
import * as employeeController from '../controllers/employeeController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createEmployeeSchema, updateEmployeeSchema } from '../validation/employeeValidation.js'

router.use(verifyTokens)

router.get('/', employeeController.getEmployees)
router.get('/:id', employeeController.getEmployeeById)
router.post('/', validate(createEmployeeSchema), employeeController.createEmployee)
router.put('/:id', validate(updateEmployeeSchema), employeeController.updateEmployee)
router.delete('/:id', employeeController.deleteEmployee)

export default router
