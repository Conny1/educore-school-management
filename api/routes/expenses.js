import express from 'express'
const router = express.Router()
import * as expenseController from '../controllers/expenseController.js'
import { checkAccess, verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createExpenseSchema, findandfilter } from '../validation/logisticsValidation.js'

router.use(verifyTokens)
router.use(checkAccess )

router.get('/', expenseController.getExpenses)
router.post('/', validate(createExpenseSchema), expenseController.createExpense)
router.put('/:id', expenseController.updateExpense)
router.post('/findandfilter', validate(findandfilter), expenseController.findandfilterExpense)
router.delete('/:id', expenseController.deleteExpense)

export default router
