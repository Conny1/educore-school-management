import Department from '../models/Department.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  return await Department.find(query)
}

export const create = async (data) => {
  return await Department.create(data)
}

export const update = async (id, data, schoolId) => {
  const department = await Department.findOneAndUpdate(
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true }
  )
  if (!department) throw new Error('Department not found')
  return department
}

export const remove = async (id, schoolId) => {
  const department = await Department.findOneAndUpdate(
    { _id: id, schoolId },
    {is_deleted:true},
    { new: true, runValidators: true }
  )
  if (!department) throw new Error('Department not found')
  return department
}
