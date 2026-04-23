import { createError } from '../configs/errorConfig.js'
import Project from '../models/Project.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.status) query.status = filters.status
  return await Project.find(query).populate('managedBy', 'firstName lastName')
}

export const create = async (data) => {
  return await Project.create(data)
}

export const update = async (id, data, schoolId) => {
  const project = await Project.findOneAndUpdate(
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true }
  )
  if (!project) throw new Error('Project not found')
  return project
}

export const findandfilterProjects = async (filter, options) => {
  const projects = await Project.paginate(filter, options);
  if (!projects) {
    throw createError(404, "projects not found.");
  }
  return projects;
};
