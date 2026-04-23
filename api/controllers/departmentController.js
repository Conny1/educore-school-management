import * as departmentService from '../services/departmentService.js'

export const getDepartments = async (req, res, next) => {
  try {
    const data = await departmentService.getAll({ 
      ...req.query, 
      schoolId: req.user.schoolId 
    })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createDepartment = async (req, res, next) => {
  try {
    const data = await departmentService.create({
      ...req.body,
      schoolId: req.user.schoolId
    })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateDepartment = async (req, res, next) => {
  try {
    const data = await departmentService.update(req.params.id, req.body, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const deleteDepartment = async (req, res, next) => {
  try {
    await departmentService.remove(req.params.id, req.user.schoolId)
    res.json({ success: true, message: 'Department deleted' })
  } catch (err) {
    next(err)
  }
}
