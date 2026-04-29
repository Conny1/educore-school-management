import express from 'express'
const router = express.Router()
import * as paymentController from '../controllers/paymentController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createPaymentSchema } from '../validation/paymentValidation.js'
import { findandfilter } from '../validation/logisticsValidation.js'

router.use(verifyTokens)
router.get('/', paymentController.getPayments)
router.post('/', validate(createPaymentSchema), paymentController.createPayment)
router.post('/findandfilter', validate(  findandfilter), paymentController.findandfilterPayments)
router.delete('/:id', paymentController.deletePayment)
router.get('/student-balance/:studentid', paymentController.getStudentBalance)


export default router
