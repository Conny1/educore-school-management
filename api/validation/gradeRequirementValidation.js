import Joi from 'joi'

export const createGradeRequirementSchema = {
  body: Joi.object({
    gradeId: Joi.string().required(),
    itemName: Joi.string().required(),
    requiredQty: Joi.number().required(),
    unit: Joi.string().required(),
    term: Joi.string().required(),
    year: Joi.string().required(),
    isActive: Joi.boolean()
  })
}

export const updateGradeRequirementSchema = {
  params: Joi.object({
    id: Joi.string().required()
  }),
  body: Joi.object({
    _id:Joi.string(),
    gradeId: Joi.string(),
    itemName: Joi.string(),
    requiredQty: Joi.number(),
    unit: Joi.string(),
    term: Joi.string(),
    year: Joi.string(),
    isActive: Joi.boolean()
  })
}
