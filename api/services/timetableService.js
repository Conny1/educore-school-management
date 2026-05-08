import Timetable from "../models/Timetable.js";
import mongoose from "mongoose";

export const getAll = async (filters = {}) => {
  const match = {
    schoolId: new mongoose.Types.ObjectId(filters.schoolId),
  };

  if (filters.gradeId)
    match.gradeId = new mongoose.Types.ObjectId(filters.gradeId);
  if (filters.employeeId)
    match.employeeId = new mongoose.Types.ObjectId(filters.employeeId);

  return await Timetable.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "employeeInfo", // Use a temporary name to avoid collision
      },
    },
    {
      $addFields: {
        // Flatten the array into an object and pick specific fields
        employee: {
          $arrayElemAt: [
            {
              $map: {
                input: "$employeeInfo",
                as: "emp",
                in: {
                  firstName: "$$emp.firstName",
                  lastName: "$$emp.lastName",
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      // Remove the temporary lookup array, leaving all original fields + new 'employee' object
      $project: { employeeInfo: 0 },
    },
  ]);
};

export const create = async (data) => {
  return await Timetable.create(data);
};

export const update = async (id, data, schoolId) => {
  const entry = await Timetable.findOneAndUpdate({ _id: id, schoolId }, data, {
    new: true,
    runValidators: true,
  });
  if (!entry) throw new Error("Timetable entry not found");
  return entry;
};

export const remove = async (id, schoolId) => {
  const entry = await Timetable.findOneAndUpdate(
    { _id: id, schoolId },
    { is_deleted: true },
    { new: true, runValidators: true },
  );
  if (!entry) throw new Error("Timetable entry not found");
  return entry;
};
