import Joi from 'joi'

export const createGradeFeeSchema = {
  body: Joi.object({
    gradeId: Joi.string().required(),
    term: Joi.string().valid('Term 1', 'Term 2', 'Term 3').required(),
    year: Joi.string().required(),
    amount: Joi.number().required(),
    description: Joi.string().allow('')
  })
}

export const updateGradeFeeSchema = {
  params: Joi.object({
    id: Joi.string().required()
  }),
  body: Joi.object({
    gradeId: Joi.string(),
    term: Joi.string().valid('Term 1', 'Term 2', 'Term 3'),
    year: Joi.string(),
    amount: Joi.number(),
    description: Joi.string().allow('')
  })
}
