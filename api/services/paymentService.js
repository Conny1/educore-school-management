import mongoose from 'mongoose'
import Payment from '../models/Payment.js'
import Student from '../models/Student.js'

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

export const getStudentBalance = async (studentId) => {
  const stats = await Student.aggregate([
    {
      $match: { 
        _id: new mongoose.Types.ObjectId(studentId),
        is_deleted: false 
      }
    },
    {
      // 1. Get Grade Fees for the student's grade
      $lookup: {
        from: 'gradefees',
        localField: 'gradeId',
        foreignField: 'gradeId',
        as: 'termFees'
      }
    },
    {
      // 2. Get all payments made by this student
      $lookup: {
        from: 'payments',
        localField: '_id',
        foreignField: 'studentId',
        as: 'allPayments'
      }
    },
    {
      // 3. Flatten the fees so we can calculate per term
      $unwind: "$termFees"
    },
    {
      // 4. Filter payments that match the specific fee's Term and Year
      $addFields: {
        paymentsForThisTerm: {
          $filter: {
            input: "$allPayments",
            as: "payment",
            cond: { 
              $and: [
                { $eq: ["$$payment.paymentFor", "$termFees.term"] },
                // Assuming payment object has a year field or extracted from paidAt
                // If your payment schema doesn't have 'year', we match by 'paymentFor' string
              ]
            }
          }
        }
      }
    },
    {
      // 5. Calculate totals for each term
      $group: {
        _id: {
          studentId: "$_id",
          term: "$termFees.term",
          year: "$termFees.year"
        },
        studentName: { $first: { $concat: ['$firstName', ' ', '$lastName'] } },
        admissionNo: { $first: "$admissionNo" },
        amountOwed: { $first: "$termFees.amount" },
        amountPaid: { $sum: { $reduce: {
          input: "$paymentsForThisTerm",
          initialValue: 0,
          in: { $add: ["$$value", "$$this.amount"] }
        }}},
      }
    },
    {
      // 6. Final Formatting
      $project: {
        _id: 0,
        studentName: 1,
        admissionNo: 1,
        term: "$_id.term",
        year: "$_id.year",
        owed: "$amountOwed",
        paid: "$amountPaid",
        balance: { $subtract: ["$amountOwed", "$amountPaid"] }
      }
    },
    { $sort: { year: -1, term: 1 } }
  ]);

  return stats;
};