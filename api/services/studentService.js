import Student from '../models/Student.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.gradeId) query.gradeId = filters.gradeId
  if (filters.status) query.status = filters.status
  return await Student.find(query)
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


export const findandfilterStudents = async (filter, options) => {
  const body = [
      {
      $lookup: {
        from: "grades",
        localField: "gradeId",
        foreignField: "_id",
        as: "grade"
      }
    },
    {
      $unwind: {
        path: "$grade",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        grade: {
          _id: "$grade._id",
          name: "$grade.name",
          stream: "$grade.stream",
        }
      }}
  ]
  const student = await Student.paginateLookup(filter, options, body);
  if (!student) {
    throw createError(404, "student not found.");
  }
  return student;
};
