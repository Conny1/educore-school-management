import Grade from '../models/Grade.js'
import { createError } from "../configs/errorConfig.js";
import * as inventoryService from "../services/inventoryService.js";
import { pick } from '../middleware/validate.js';
import { Types } from 'mongoose';
const { ObjectId } = Types;

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


export const findandfilterGrade = async (filter, options) => {
 const body = [
      {
      $lookup: {
        from: "emplyees",
        localField: "classTeacherId",
        foreignField: "_id",
        as: "classTeacher"
      }
    },
    {
      $unwind: {
        path: "$classTeacher",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        classTeacher: {
          _id: "$classTeacher._id",
          name: { $concat: ["$classTeacher.firstName", " ", "$classTeacher.lastName"] },
        }
      }}
  ]
  const grade = await Grade.paginateLookup(filter, options, body);
  if (!grade) {
    throw createError(404, "grade not found.");
  }
  return grade;
};

