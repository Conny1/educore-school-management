import * as reportService from '../services/reportService.js'

export const getFeeCollectionReport = async (req, res, next) => {
  try {
    const data = await reportService.getFeeCollection({ ...req.query, schoolId: req.user.schoolId })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const getAttendanceReport = async (req, res, next) => {
  try {
    const data = await reportService.getAttendanceSummary({ ...req.query, schoolId: req.user.schoolId })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const getExpenseReport = async (req, res, next) => {
  try {
    const data = await reportService.getExpenseBreakdown({ ...req.query, schoolId: req.user.schoolId })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const getRequirementReport = async (req, res, next) => {
  try {
    const data = await reportService.getRequirementFulfillment({ ...req.query, schoolId: req.user.schoolId })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
} 

export const dashbardSummary = async (req, res, next) => {
  try {
    const data = await reportService.dashbardSummary( req.user.schoolId )
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
} 
