import Timetable from '../models/Timetable.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.gradeId) query.gradeId = filters.gradeId
  if (filters.employeeId) query.employeeId = filters.employeeId
  return await Timetable.find(query)
    .populate('gradeId', 'name stream')
    .populate('employeeId', 'firstName lastName')
}

export const create = async (data) => {
  return await Timetable.create(data)
}

export const update = async (id, data, schoolId) => {
  const entry = await Timetable.findOneAndUpdate(
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true }
  )
  if (!entry) throw new Error('Timetable entry not found')
  return entry
}

export const remove = async (id, schoolId) => {
  const entry = await Timetable.findOneAndUpdate(
    { _id: id, schoolId },
    {is_deleted:true},
    { new: true, runValidators: true }
  )
  if (!entry) throw new Error('Timetable entry not found')
  return entry
}
