import { pick } from '../middleware/validate.js';
import { createError } from '../configs/errorConfig.js';
import { Types } from 'mongoose';
const { ObjectId } = Types;
import * as schoolService from '../services/schoolService.js'



export const getSchools = async (req, res, next) => {
  try {
    const data = await schoolService.getAll(req.query)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const getSchoolById = async (req, res, next) => {
  try {
    const data = await schoolService.getById(req.params.id)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createSchool = async (req, res, next) => {
  try {
    const data = await schoolService.create(req.body)
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateSchool = async (req, res, next) => {
  try {
    const data = await schoolService.update(req.params.id, req.body)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
export const findandfilterSchool = async (req, resp, next) => {
  try {
    let filter = { };

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

    const client = await schoolService.findandfilterSchool(filter, options);

    resp.status(200).json({ status: 200, data: client });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};
