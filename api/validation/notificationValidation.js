import Joi from "joi";

export const resetPassword = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};
