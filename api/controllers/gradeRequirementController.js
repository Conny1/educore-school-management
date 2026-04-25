import * as gradeRequirementService from '../services/gradeRequirementService.js'

export const getGradeRequirements = async (req, res, next) => {
  try {
    const data = await gradeRequirementService.getAll({ 
      ...req.query, 
      schoolId: req.user.schoolId ,
    })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createGradeRequirement = async (req, res, next) => {
  try {
    const data = await gradeRequirementService.create({
      ...req.body,
      schoolId: req.user.schoolId
    })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateGradeRequirement = async (req, res, next) => {
  try {
    const data = await gradeRequirementService.update(req.params.id, req.body, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const deleteGradeRequirement = async (req, res, next) => {
  try {
    await gradeRequirementService.remove(req.params.id, req.user.schoolId)
    res.json({ success: true, message: 'Requirement deleted' })
  } catch (err) {
    next(err)
  }
}
