import Joi from 'joi'

export const createTimetableSchema = {
  body: Joi.object({
    gradeId: Joi.string().required(),
    employeeId: Joi.string().required(),
    subject: Joi.string().required(),
    dayOfWeek: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday').required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    room: Joi.string().allow('')
  })
}
