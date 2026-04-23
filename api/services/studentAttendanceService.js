import StudentAttendance from '../models/StudentAttendance.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.gradeId) query.gradeId = filters.gradeId
  if (filters.date) query.date = filters.date
  return await StudentAttendance.find(query).populate('studentId', 'firstName lastName admissionNo')
}

export const create = async (data) => {
  return await StudentAttendance.create(data)
}

export const bulkCreate = async (records) => {
  return await StudentAttendance.insertMany(records)
}
