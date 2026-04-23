import Student from '../models/Student.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.gradeId) query.gradeId = filters.gradeId
  if (filters.status) query.status = filters.status
  return await Student.find(query).populate('gradeId', 'name stream')
}

export const getById = async (id, schoolId) => {
  const student = await Student.findOne({ _id: id, schoolId })
    .populate('gradeId', 'name stream')
  if (!student) throw new Error('Student not found')
  return student
}

export const create = async (data) => {
  const existing = await Student.findOne({
    schoolId: data.schoolId,
    admissionNo: data.admissionNo
  })
  if (existing) throw new Error('Admission number already exists for this school')
  return await Student.create(data)
}

export const update = async (id, data, schoolId) => {
  const student = await Student.findOneAndUpdate(
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true }
  )
  if (!student) throw new Error('Student not found')
  return student
}

export const remove = async (id, schoolId) => {
  const student = await Student.findOneAndUpdate(
    { _id: id, schoolId },
    {is_deleted:true},
    { new: true, runValidators: true }
  )
  if (!student) throw new Error('Student not found')
  return student
}
