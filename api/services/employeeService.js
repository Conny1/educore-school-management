import Employee from '../models/Employee.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.departmentId) query.departmentId = filters.departmentId
  if (filters.role) query.role = filters.role
  if (filters.status) query.status = filters.status
  return await Employee.find(query)
    .populate('departmentId', 'name')
    .populate('gradeId', 'name stream')
}

export const getById = async (id, schoolId) => {
  const employee = await Employee.findOne({ _id: id, schoolId })
    .populate('departmentId', 'name')
    .populate('gradeId', 'name stream')
  if (!employee) throw new Error('Employee not found')
  return employee
}

export const create = async (data) => {
  const existingNo = await Employee.findOne({
    schoolId: data.schoolId,
    staffNo: data.staffNo
  })
  if (existingNo) throw new Error('Staff number already exists for this school')
  
  const existingEmail = await Employee.findOne({
    schoolId: data.schoolId,
    email: data.email
  })
  if (existingEmail) throw new Error('Staff email already exists for this school')

  return await Employee.create(data)
}

export const update = async (id, data, schoolId) => {
  const employee = await Employee.findOneAndUpdate(
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true }
  )
  if (!employee) throw new Error('Employee not found')
  return employee
}

export const remove = async (id, schoolId) => {
  const employee = await Employee.findOneAndUpdate(
    { _id: id, schoolId },
    {is_deleted:true},
    { new: true, runValidators: true }
  )
  if (!employee) throw new Error('Employee not found')
  return employee
}
