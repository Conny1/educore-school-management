import * as gradeService from '../services/gradeService.js'

export const getGrades = async (req, res, next) => {
  try {
    const data = await gradeService.getAll({
      ...req.query,
      schoolId: req.user.schoolId
    })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const getGradeById = async (req, res, next) => {
  try {
    const data = await gradeService.getById(req.params.id, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createGrade = async (req, res, next) => {
  try {
    const data = await gradeService.create({
      ...req.body,
      schoolId: req.user.schoolId
    })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateGrade = async (req, res, next) => {
  try {
    const data = await gradeService.update(
      req.params.id,
      req.body,
      req.user.schoolId
    )
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const deleteGrade = async (req, res, next) => {
  try {
    await gradeService.remove(req.params.id, req.user.schoolId)
    res.json({ success: true, message: 'Grade deleted' })
  } catch (err) {
    next(err)
  }
}
