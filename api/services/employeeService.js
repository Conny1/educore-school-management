import Employee from "../models/Employee.js";

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId };
  if (filters.departmentId) query.departmentId = filters.departmentId;
  if (filters.role) query.role = filters.role;
  if (filters.status) query.status = filters.status;
  return await Employee.find(query)
    .populate("departmentId", "name")
    .populate("gradeId", "name stream");
};

export const getById = async (id, schoolId) => {
  const employee = await Employee.findOne({ _id: id, schoolId })
    .populate("departmentId", "name")
    .populate("gradeId", "name stream");
  if (!employee) throw new Error("Employee not found");
  return employee;
};

export const create = async (data) => {
  const existingNo = await Employee.findOne({
    schoolId: data.schoolId,
    staffNo: data.staffNo,
  });
  if (existingNo)
    throw new Error("Staff number already exists for this school");

  const existingEmail = await Employee.findOne({
    schoolId: data.schoolId,
    email: data.email,
  });
  if (existingEmail)
    throw new Error("Staff email already exists for this school");

  return await Employee.create(data);
};

export const update = async (id, data, schoolId) => {
  const employee = await Employee.findOneAndUpdate(
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true },
  );
  if (!employee) throw new Error("Employee not found");
  return employee;
};

export const remove = async (id, schoolId) => {
  const employee = await Employee.findOneAndUpdate(
    { _id: id, schoolId },
    { is_deleted: true },
    { new: true, runValidators: true },
  );
  if (!employee) throw new Error("Employee not found");
  return employee;
};

export const findandfilterEmployee = async (filter, options) => {
 const body = [
    {
      $lookup: {
        from: "grades",
        localField: "gradeId",
        foreignField: "_id",
        as: "grade",
      },
    },
    {
      $unwind: {
        path: "$grade",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "departmentId",
        foreignField: "_id",
        as: "department",
      },
    },
    {
      $unwind: {
        path: "$department",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        grade: {
          _id: "$grade._id",
          name: "$grade.name",
        },
        department:{
             _id: "$department._id",
          name: "$department.name",
        }
      },
    },
  ];
  const employee = await Employee.paginateLookup(filter, options, body);
  if (!employee) {
    throw createError(404, "employee not found.");
  }
  return employee;
};

export const employeeStats = async(schoolId)=>{
  const stats = await Employee.aggregate([
  { 
    // Filter to include only non-deleted employees
    $match: { is_deleted: false, schoolId:schoolId} 
  },
  {
    $facet: {
      totalEmployees: [{ $count: "count" }],
      activeEmployees: [
        { $match: { status: 'active' } },
        { $count: "count" }
      ],
      teachers: [
        { $match: { role: 'teacher' } },
        { $count: "count" }
      ],
      onLeave: [
        { $match: { status: 'on_leave' } },
        { $count: "count" }
      ]
    }
  },
  {
    $project: {
      total: { $arrayElemAt: ["$totalEmployees.count", 0] },
      active: { $arrayElemAt: ["$activeEmployees.count", 0] },
      teachers: { $arrayElemAt: ["$teachers.count", 0] },
      onLeave: { $arrayElemAt: ["$onLeave.count", 0] }
    }
  }
]);

return stats[0]
}
