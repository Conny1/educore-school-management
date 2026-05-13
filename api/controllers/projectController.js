import * as projectService from '../services/projectService.js'
import { pick } from '../middleware/validate.js';
import { createError } from '../configs/errorConfig.js';
import { Types } from 'mongoose';
const { ObjectId } = Types;


export const getProjects = async (req, res, next) => {
  try {
    const data = await projectService.getAll({ ...req.query, schoolId: req.user.schoolId })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createProject = async (req, res, next) => {
  try {
    const data = await projectService.create({ ...req.body, schoolId: req.user.schoolId, createdBy:req.user._id })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateProject = async (req, res, next) => {
  try {
    const data = await projectService.update(req.params.id, req.body, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
export const findandfilterProjects = async (req, resp, next) => {
  try {
    let filter = { is_deleted: false, schoolId: new ObjectId(req.user.schoolId) };

    for (let key in req.body.match_values) {
      if (req.body.match_values[key] || req.body.match_values[key] === "") {
        filter[key] = req.body.match_values[key];
      }
      if (ObjectId.isValid(req.body.match_values[key]))
        filter[key] = new ObjectId(req.body.match_values[key]);
      else if (Array.isArray(req.body.match_values[key]))
        filter[key] = { $in: req.body.match_values[key] };
    }
    const options = pick(req.body, ["sortBy", "limit", "page"]);
    if (req.body?.search) {
      filter["$or"] = [
        {
          title: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
        {
          description: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
       
      ];
    }

    const client = await projectService.findandfilterProjects(filter, options);

    resp.status(200).json({ status: 200, data: client });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};
