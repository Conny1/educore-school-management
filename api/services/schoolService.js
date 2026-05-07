
import { createError } from '../configs/errorConfig.js'
import School from '../models/School.js'

export const getAll = async (filters = {}) => {
  const query = filters
  return await School.find(query)
}


export const getById = async (id) => {
  return await School.findById(id)
}

export const create = async (data) => {
  return await School.create(data)
}

export const update = async (id, data) => {
  const school = await School.findOneAndUpdate(
    { _id: id },
    data,
    { new: true, runValidators: true }
  )
  if (!school) throw new Error('school not found')
  return school
}

export const findandfilterSchool = async (filter, options) => {
  const schools = await School.paginate(filter, options);
  if (!schools) {
    throw createError(404, "schools not found.");
  }
  return schools;
};
