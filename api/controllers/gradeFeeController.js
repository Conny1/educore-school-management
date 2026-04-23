import * as gradeFeeService from '../services/gradeFeeService.js'

export const getGradeFees = async (req, res, next) => {
  try {
    const data = await gradeFeeService.getAll({ 
      ...req.query, 
      schoolId: req.user.schoolId 
    })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createGradeFee = async (req, res, next) => {
  try {
    const data = await gradeFeeService.create({
      ...req.body,
      schoolId: req.user.schoolId
    })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateGradeFee = async (req, res, next) => {
  try {
    const data = await gradeFeeService.update(req.params.id, req.body, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const deleteGradeFee = async (req, res, next) => {
  try {
    await gradeFeeService.remove(req.params.id, req.user.schoolId)
    res.json({ success: true, message: 'Grade fee deleted' })
  } catch (err) {
    next(err)
  }
}
