import Joi from 'joi'

export const createPaymentSchema = {
  body: Joi.object({
    studentId: Joi.string().required(),
    receiptNo: Joi.string().required(),
    amount: Joi.number().required(),
    paymentFor: Joi.string().required(),
    method: Joi.string().valid('cash', 'mpesa', 'bank_transfer', 'cheque').required(),
    reference: Joi.string().allow(''),
    paidAt: Joi.string().required(),
  })
}
