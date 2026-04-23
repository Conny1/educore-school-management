import Grade from '../models/Grade.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.level) query.level = filters.level
  return await Grade.find(query).populate('classTeacherId', 'firstName lastName')
}

export const getById = async (id, schoolId) => {
  const grade = await Grade.findOne({ _id: id, schoolId })
    .populate('classTeacherId', 'firstName lastName')
  if (!grade) throw new Error('Grade not found')
  return grade
}

export const create = async (data) => {
  return await Grade.create(data)
}

export const update = async (id, data, schoolId) => {
  const grade = await Grade.findOneAndUpdate(
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true }
  )
  if (!grade) throw new Error('Grade not found')
  return grade
}

export const remove = async (id, schoolId) => {
  const grade = await Grade.findOneAndUpdate(
    { _id: id, schoolId },
    {is_deleted:true},
    { new: true, runValidators: true }
  );
  if (!grade) throw new Error('Grade not found')
  return grade
}
