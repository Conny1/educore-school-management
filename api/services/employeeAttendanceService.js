import EmployeeAttendance from '../models/EmployeeAttendance.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.employeeId) query.employeeId = filters.employeeId
  if (filters.date) query.date = filters.date
  return await EmployeeAttendance.find(query).populate('employeeId', 'firstName lastName staffNo')
}

export const create = async (data) => {
  return await EmployeeAttendance.create(data)
}

export const bulkCreate = async (records) => {
  return await EmployeeAttendance.insertMany(records)
}
