import * as timetableService from '../services/timetableService.js'

export const getTimetable = async (req, res, next) => {
  try {
    const data = await timetableService.getAll({ ...req.query, schoolId: req.user.schoolId })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createTimetableEntry = async (req, res, next) => {
  try {
    const data = await timetableService.create({ ...req.body, schoolId: req.user.schoolId })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateTimetableEntry = async (req, res, next) => {
  try {
    const data = await timetableService.update(req.params.id, req.body, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const deleteTimetableEntry = async (req, res, next) => {
  try {
    await timetableService.remove(req.params.id, req.user.schoolId)
    res.json({ success: true, message: 'Deleted' })
  } catch (err) {
    next(err)
  }
}
