import Joi from 'joi'

export const createGradeSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    stream: Joi.string().allow(''),
    level: Joi.string().required(),
    classTeacherId: Joi.string().allow(null)
  })
}

export const updateGradeSchema = {
  params: Joi.object({
    id: Joi.string().required()
  }),
  body: Joi.object({
    _id:Joi.string(),
    name: Joi.string(),
    stream: Joi.string().allow(''),
    level: Joi.string(),
    classTeacherId: Joi.string().allow(null) 
  })
}
