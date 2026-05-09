import Joi from "joi";

export const createUser = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    employeeId: Joi.string().required(),
    role: Joi.string().allow("admin", "teacher", "finance", "management"),
  }),
};
