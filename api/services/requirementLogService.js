import StudentRequirementLog from '../models/StudentRequirementLog.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.studentId) query.studentId = filters.studentId
  if (filters.requirementId) query.requirementId = filters.requirementId
  return await StudentRequirementLog.find(query)
  
}

export const create = async (data) => {
  return await StudentRequirementLog.create(data)
}
