import * as employeeService from '../services/employeeService.js'

export const getEmployees = async (req, res, next) => {
  try {
    const data = await employeeService.getAll({
      ...req.query,
      schoolId: req.user.schoolId
    })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const getEmployeeById = async (req, res, next) => {
  try {
    const data = await employeeService.getById(req.params.id, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createEmployee = async (req, res, next) => {
  try {
    const data = await employeeService.create({
      ...req.body,
      schoolId: req.user.schoolId
    })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateEmployee = async (req, res, next) => {
  try {
    const data = await employeeService.update(
      req.params.id,
      req.body,
      req.user.schoolId
    )
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const deleteEmployee = async (req, res, next) => {
  try {
    await employeeService.remove(req.params.id, req.user.schoolId)
    res.json({ success: true, message: 'Employee deleted' })
  } catch (err) {
    next(err)
  }
}
