import Joi from 'joi'

export const recordAttendanceSchema = {
  body: Joi.object({
    employeeId: Joi.string(),
    studentId: Joi.string(),
    gradeId: Joi.string(),
    date: Joi.string().required(),
    status: Joi.string().required(),
    checkIn: Joi.string().allow(null),
    checkOut: Joi.string().allow(null),
    remarks: Joi.string().allow(''),
    
  })
}

export const bulkAttendanceSchema = {
  body: Joi.array().items(Joi.object({
    employeeId: Joi.string(),
    studentId: Joi.string(),
    gradeId: Joi.string(),
    date: Joi.string().required(),
    status: Joi.string().required(),
    checkIn: Joi.string().allow(null),
    checkOut: Joi.string().allow(null),
    remarks: Joi.string().allow(''),
  }))
}
