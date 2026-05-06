import mongoose from 'mongoose'
import Student from '../models/Student.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.gradeId) query.gradeId = filters.gradeId
  if (filters.status) query.status = filters.status
  return await Student.find(query)
}


export const getById = async (id, schoolId) => {
  const studentData = await Student.aggregate([
    {
      // 1. Filter by ID and School
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        schoolId: new mongoose.Types.ObjectId(schoolId),
        is_deleted: false
      }
    },
    {
      // 2. Join with Grades collection
      $lookup: {
        from: 'grades', // Ensure this matches your actual Grade collection name
        localField: 'gradeId',
        foreignField: '_id',
        as: 'grade'
      }
    },
    {
      // 3. Convert grade array to a single object
      $unwind: {
        path: '$grade',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      // 4. Project (Format) the final object
      $project: {
        firstName:1,
        lastName:1,
        admissionNo: 1,
        firstName: 1,
        lastName: 1,
        dob: 1,
        gender: 1,
        guardianName: 1,
        guardianPhone: 1,
        status: 1,
        enrolledAt: 1,
        grade: 1, // This now contains the full grade object
        createdAt: 1
      }
    }
  ]);

  if (!studentData || studentData.length === 0) {
    throw new Error('Student not found');
  }

  // Return the first (and only) result from the array
  return studentData[0];
};
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


export const getStudentTermlyFinancials = async (studentId) => {
  const financials = await Student.aggregate([
    {
      // 1. Get the specific student and their current grade
      $match: { 
        _id: new mongoose.Types.ObjectId(studentId),
        is_deleted: false 
      }
    },
    {
      // 2. Fetch all Fee structures assigned to this student's grade
      $lookup: {
        from: 'gradefees',
        localField: 'gradeId',
        foreignField: 'gradeId',
        pipeline: [{ $match: { is_deleted: false } }],
        as: 'gradeFees'
      }
    },
    {
      // 3. Fetch all payments made by this student
      $lookup: {
        from: 'payments',
        localField: '_id',
        foreignField: 'studentId',
        pipeline: [{ $match: { is_deleted: false } }],
        as: 'allPayments'
      }
    },
    {
      // 4. Expand the gradeFees array so we calculate totals per fee record
      $unwind: "$gradeFees"
    },
    {
      // 5. Group and sum payments by matching payment.gradeFeeId to gradeFee._id
      $project: {
        term: "$gradeFees.term",
        year: "$gradeFees.year",
        totalAmount: "$gradeFees.amount",
        totalPaid: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: "$allPayments",
                  as: "payment",
                  cond: { 
                    $eq: ["$$payment.gradeFeeId", "$gradeFees._id"] 
                  }
                }
              },
              as: "p",
              in: "$$p.amount"
            }
          }
        }
      }
    },
    {
      // 6. Calculate balance and clean up the response
      $project: {
        _id: 1,
        term: 1,
        year: 1,
        amount: "$totalAmount",
        paid: "$totalPaid",
        balance: { $subtract: ["$totalAmount", "$totalPaid"] }
      }
    },
    {
      // 7. Order by most recent year and term
      $sort: { year: -1, term: -1 }
    }
  ]);

  return financials;
};


export const getStudentRequirementStatus = async (studentId) => {
  const status = await Student.aggregate([
    {
      // 1. Target the specific student
      $match: {
        _id: new mongoose.Types.ObjectId(studentId),
        is_deleted: false
      }
    },
    {
      // 2. Lookup all requirements set for this student's grade
      $lookup: {
        from: 'graderequirements',
        localField: 'gradeId',
        foreignField: 'gradeId',
        pipeline: [{ $match: { is_deleted: false, isActive: true } }],
        as: 'gradeRequirements'
      }
    },
    {
      // 3. Lookup all logs of items this specific student has brought
      $lookup: {
        from: 'studentrequirementlogs',
        localField: '_id',
        foreignField: 'studentId',
        pipeline: [{ $match: { is_deleted: false } }],
        as: 'deliveryLogs'
      }
    },
    {
      // 4. Deconstruct the requirements array to process each item
      $unwind: "$gradeRequirements"
    },
    {
      // 5. Calculate the total quantity brought for each specific requirement
      $project: {
        _id: 0,
        requirementId: "$gradeRequirements._id",
        itemName: "$gradeRequirements.itemName",
        requiredQty: "$gradeRequirements.requiredQty",
        unit: "$gradeRequirements.unit",
        term: "$gradeRequirements.term",
        year: "$gradeRequirements.year",
        // Sum qtyBrought only where the log's requirementId matches current gradeRequirement._id
        broughtQty: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: "$deliveryLogs",
                  as: "log",
                  cond: { $eq: ["$$log.requirementId", "$gradeRequirements._id"] }
                }
              },
              as: "item",
              in: "$$item.qtyBrought"
            }
          }
        }
      }
    },
    {
      // 6. Add status flags for UI convenience
      $addFields: {
        isComplete: { $gte: ["$broughtQty", "$requiredQty"] },
        pendingQty: { 
          $max: [0, { $subtract: ["$requiredQty", "$broughtQty"] }] 
        }
      }
    },
    {
      // 7. Sort by term and name
      $sort: { year: -1, term: 1, itemName: 1 }
    }
  ]);

  return status;
};