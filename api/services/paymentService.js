import Payment from '../models/Payment.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.studentId) query.studentId = filters.studentId
  if (filters.method) query.method = filters.method
  return await Payment.find(query)
    .populate('studentId', 'firstName lastName admissionNo')
    .populate('gradeFeeId', 'term year amount')
}

export const create = async (data) => {
  const existing = await Payment.findOne({
    schoolId: data.schoolId,
    receiptNo: data.receiptNo
  })
  if (existing) throw new Error('Receipt number already exists for this school')
  return await Payment.create(data)
}

export const remove = async (id, schoolId) => {
  const payment = await Payment.findOneAndUpdate(
    { _id: id, schoolId },
    {is_deleted:true},
    { new: true, runValidators: true }
  )
  if (!payment) throw new Error('Payment not found')
  return payment
}

export const findandfilterPayments = async (filter, options) => {
  let body = [
    {
  $lookup: {
    from: "students",
    let: { studentId: "$studentId" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$studentId"] }
        }
      },

      // 👉 second lookup INSIDE student
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

      // 👉 shape student object
      {
        $project: {
          _id: 1,
          admissionNo: 1,
          firstName:1,
          lastName:1,
          grade: {
            _id: "$grade._id",
            name: "$grade.name"
          }
        }
      }
    ],
    as: "student"
  }
},
{
  $unwind: {
    path: "$student",
    preserveNullAndEmptyArrays: true
  }
},
     {
      $addFields: {
        student: {
          _id: "$student._id",
          name: "$student.firstName",
          email: "$student.lastName",
          admissionNo:"$student.admissionNo",
          grade: "$student.grade"
        }
      }
    }
  ]
  const payment = await Payment.paginateLookup(filter, options, body);
  if (!payment) {
    throw createError(404, "payment not found.");
  }
  return payment;
};


