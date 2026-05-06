import GradeRequirement from '../models/GradeRequirement.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId, is_deleted:false }
  if (filters.gradeId) query.gradeId = filters.gradeId
  if (filters.isActive !== undefined) query.isActive = filters.isActive
  // console.log(query)
  return await GradeRequirement.find(query)
}

export const create = async (data) => {
  return await GradeRequirement.create(data)
}

export const update = async (id, data, schoolId) => {
  const req = await GradeRequirement.findOneAndUpdate(
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true }
  )
  if (!req) throw new Error('Requirement not found')
  return req
}

export const remove = async (id, schoolId) => {
  const req = await GradeRequirement.findOneAndUpdate(
    { _id: id, schoolId },
    {is_deleted:true},
    { new: true, runValidators: true }
  )
  if (!req) throw new Error('Requirement not found')
  return req
}
