import * as requirementLogService from '../services/requirementLogService.js'

export const getRequirementLogs = async (req, res, next) => {
  try {
    const data = await requirementLogService.getAll({ ...req.query, schoolId: req.user.schoolId })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createRequirementLog = async (req, res, next) => {
  try {
    const data = await requirementLogService.create({ ...req.body, schoolId: req.user.schoolId, recordedBy:req.user._id })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
