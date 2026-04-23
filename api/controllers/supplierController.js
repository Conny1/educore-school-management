import * as supplierService from '../services/supplierService.js'
import { pick } from '../middleware/validate.js';
import { createError } from '../configs/errorConfig.js';
import { Types } from 'mongoose';
const { ObjectId } = Types;


export const getSuppliers = async (req, res, next) => {
  try {
    const data = await supplierService.getAll({ ...req.query, schoolId: req.user.schoolId, })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createSupplier = async (req, res, next) => {
  try {
    const data = await supplierService.create({ ...req.body, schoolId: req.user.schoolId , createdBy:req.user._id})
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateSupplier = async (req, res, next) => {
  try {
    const data = await supplierService.update(req.params.id, req.body, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const findandfilterSuppliers = async (req, resp, next) => {
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

    const client = await supplierService.findandfilterSuppliers(filter, options);

    resp.status(200).json({ status: 200, data: client });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};


export const deleteSupplier = async (req, res, next) => {
  try {
    const data = await supplierService.delet(req.params.id, req.body, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
