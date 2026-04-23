import GradeFee from '../models/GradeFee.js'
import Payment from '../models/Payment.js'
import StudentAttendance from '../models/StudentAttendance.js'
import EmployeeAttendance from '../models/EmployeeAttendance.js'
import Expense from '../models/Expense.js'
import GradeRequirement from '../models/GradeRequirement.js'
import StudentRequirementLog from '../models/StudentRequirementLog.js'
import Student from '../models/Student.js'

export const getFeeCollection = async ({ schoolId, term, year }) => {
  const fees = await GradeFee.find({ schoolId, term, year }).populate('gradeId', 'name stream')
  return await Promise.all(fees.map(async (fee) => {
    const payments = await Payment.aggregate([
      { $match: { schoolId: fee.schoolId, gradeFeeId: fee._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    const collected = payments[0]?.total || 0
    return {
      grade: fee.gradeId,
      term: fee.term,
      year: fee.year,
      expected: fee.amount,
      collected,
      outstanding: fee.amount - collected
    }
  }))
}

export const getAttendanceSummary = async ({ schoolId, type, gradeId, startDate, endDate }) => {
  const Model = type === 'employee' ? EmployeeAttendance : StudentAttendance
  const match = { schoolId, date: { $gte: startDate, $lte: endDate } }
  if (gradeId) match.gradeId = gradeId
  return await Model.aggregate([
    { $match: match },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ])
}

export const getExpenseBreakdown = async ({ schoolId, startDate, endDate }) => {
  return await Expense.aggregate([
    { $match: { schoolId, expenseDate: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ])
}

export const getRequirementFulfillment = async ({ schoolId, gradeId, term, year }) => {
  const requirements = await GradeRequirement.find({ schoolId, gradeId, term, year, isActive: true })
  const totalStudents = await Student.countDocuments({ schoolId, gradeId, status: 'active' })
  return await Promise.all(requirements.map(async (req) => {
    const logs = await StudentRequirementLog.find({ schoolId, requirementId: req._id })
    const fully = logs.filter(l => l.qtyBrought >= req.requiredQty).length
    const partial = logs.filter(l => l.qtyBrought > 0 && l.qtyBrought < req.requiredQty).length
    const none = totalStudents - fully - partial
    return {
      item: req.itemName,
      required: req.requiredQty,
      unit: req.unit,
      totalStudents,
      fullyMet: fully,
      partial,
      notBrought: none
    }
  }))
}
