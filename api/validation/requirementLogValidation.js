import Joi from 'joi'

export const createRequirementLogSchema = {
  body: Joi.object({
    studentId: Joi.string().required(),
    requirementId: Joi.string().required(),
    qtyBrought: Joi.number().required(),
    dateRecorded: Joi.string().required(),
    remarks: Joi.string().allow(''),
  })
}
