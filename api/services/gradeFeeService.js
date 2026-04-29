import GradeFee from '../models/GradeFee.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId, is_deleted:false }
  if (filters.gradeId) query.gradeId = filters.gradeId
  if (filters.term) query.term = filters.term
  if (filters.year) query.year = filters.year
  console.log(filters)
  return await GradeFee.find(query).populate('gradeId', 'name stream')
}

export const create = async (data) => {
  return await GradeFee.create(data)
}

export const update = async (id, data, schoolId) => {
  const fee = await GradeFee.findOneAndUpdate (
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true }
  )
  if (!fee) throw new Error('GradeFee not found')
  return fee
}

export const remove = async (id, schoolId) => {
  const fee = await GradeFee.findOneAndUpdate (
    { _id: id, schoolId },
    {is_deleted:true},
    { new: true, runValidators: true }
  )
  if (!fee) throw new Error('GradeFee not found')
  return fee
}
