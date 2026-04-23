import * as studentService from '../services/studentService.js'

export const getStudents = async (req, res, next) => {
  try {
    const data = await studentService.getAll({
      ...req.query,
      schoolId: req.user.schoolId
    })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const getStudentById = async (req, res, next) => {
  try {
    const data = await studentService.getById(req.params.id, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createStudent = async (req, res, next) => {
  try {
    const data = await studentService.create({
      ...req.body,
      schoolId: req.user.schoolId
    })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateStudent = async (req, res, next) => {
  try {
    const data = await studentService.update(
      req.params.id,
      req.body,
      req.user.schoolId
    )
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const deleteStudent = async (req, res, next) => {
  try {
    await studentService.remove(req.params.id, req.user.schoolId)
    res.json({ success: true, message: 'Student deleted' })
  } catch (err) {
    next(err)
  }
}
