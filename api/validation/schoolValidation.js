import Joi from "joi";

export const createSchoolValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    currentTerm: Joi.string().valid("Term 1", "Term 2", "Term 3"),
    currentYear: Joi.string().required(),
  }),
};
