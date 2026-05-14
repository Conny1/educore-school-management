import * as studentAttendanceService from '../services/studentAttendanceService.js'

export const getStudentAttendance = async (req, res, next) => {
  try {
    const data = await studentAttendanceService.getAll({ ...req.query, schoolId: req.user.schoolId })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const recordStudentAttendance = async (req, res, next) => {
  try {
    const data = await studentAttendanceService.create({ ...req.body, schoolId: req.user.schoolId,recordedBy:req.user._id })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const bulkRecordStudentAttendance = async (req, res, next) => {
  try {
    const records = req.body.map(r => ({ ...r, schoolId: req.user.schoolId , recordedBy:req.user._id}))
    const data = await studentAttendanceService.bulkCreate(records)
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
