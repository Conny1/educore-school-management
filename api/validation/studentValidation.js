import Joi from 'joi'

export const createStudentSchema = {
  body: Joi.object({
    gradeId: Joi.string().required(),
    admissionNo: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dob: Joi.string().required(),
    gender: Joi.string().valid('male', 'female').required(),
    guardianName: Joi.string().required(),
    guardianPhone: Joi.string().pattern(/^0[17]\d{8}$/).required().messages({
      'string.pattern.base': 'Phone must be a valid Kenyan number (07XX or 01XX, 10 digits)'
    }),
    status: Joi.string().valid('active', 'suspended', 'transferred', 'graduated').default('active'),
    enrolledAt: Joi.string().required()
  })
}

export const updateStudentSchema = {
  params: Joi.object({
    id: Joi.string().required()
  }),
  body: Joi.object({
    gradeId: Joi.string(),
    admissionNo: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    dob: Joi.string(),
    gender: Joi.string().valid('male', 'female'),
    guardianName: Joi.string(),
    guardianPhone: Joi.string().pattern(/^0[17]\d{8}$/).messages({
      'string.pattern.base': 'Phone must be a valid Kenyan number'
    }),
    status: Joi.string().valid('active', 'suspended', 'transferred', 'graduated'),
    enrolledAt: Joi.string()
  })
}
