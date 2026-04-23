import * as employeeAttendanceService from '../services/employeeAttendanceService.js'

export const getEmployeeAttendance = async (req, res, next) => {
  try {
    const data = await employeeAttendanceService.getAll({ ...req.query, schoolId: req.user.schoolId })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const recordEmployeeAttendance = async (req, res, next) => {
  try {
    const data = await employeeAttendanceService.create({ ...req.body, schoolId: req.user.schoolId })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const bulkRecordEmployeeAttendance = async (req, res, next) => {
  try {
    const records = req.body.map(r => ({ ...r, schoolId: req.user.schoolId }))
    const data = await employeeAttendanceService.bulkCreate(records)
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
