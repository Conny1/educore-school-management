import * as userService from '../services/userService.js'
import { pick } from '../middleware/validate.js';
import { createError } from '../configs/errorConfig.js';
import { Types } from 'mongoose';
const { ObjectId } = Types;


export const getUsers = async (req, res, next) => {
  try {
    const data = await userService.getAll({ ...req.query, schoolId: req.user.schoolId, })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createUser = async (req, res, next) => {
  try {
    const data = await userService.create({ ...req.body, schoolId: req.user.schoolId })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const data = await userService.update(req.params.id, req.body, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const findandfilterUser = async (req, resp, next) => {
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
          contactPerson: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
        {
          name: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
           {
          email: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
       
      ];
    }

    const client = await userService.findandfilterUser(filter, options);

    resp.status(200).json({ status: 200, data: client });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const data = await userService.delet(req.params.id, req.body, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
