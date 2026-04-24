import Joi from "joi";

export const createEmployeeSchema = {
  body: Joi.object({
    departmentId: Joi.string().required(),
    gradeId: Joi.string().allow(null),
    staffNo: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string()
      .valid("teacher", "admin", "support", "management", "finance")
      .required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    hireDate: Joi.string().required(),
    status: Joi.string()
      .valid("active", "inactive", "on_leave")
      .default("active"),
  }),
};

export const updateEmployeeSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    _id: Joi.string().required(),
    departmentId: Joi.string(),
    gradeId: Joi.string().allow(null),
    staffNo: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    role: Joi.string().valid(
      "teacher",
      "admin",
      "support",
      "management",
      "finance",
    ),
    phone: Joi.string(),
    email: Joi.string().email(),
    hireDate: Joi.string(),
    status: Joi.string().valid("active", "inactive", "on_leave"),
  }),
};
