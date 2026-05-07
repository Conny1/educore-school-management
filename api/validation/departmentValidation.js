import Joi from "joi";

export const createDepartmentSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(""),
  }),
};

export const updateDepartmentSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    _id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string().allow(""),
  }),
};
