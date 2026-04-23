import { createError } from '../configs/errorConfig.js'
import * as expenseService from '../services/expenseService.js'
import { pick } from '../middleware/validate.js';
import { Types } from 'mongoose';
const { ObjectId } = Types;

export const getExpenses = async (req, res, next) => {
  try {
    const data = await expenseService.getAll({ ...req.query, schoolId: req.user.schoolId })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createExpense = async (req, res, next) => {
  try {
    const data = await expenseService.create({ ...req.body, schoolId: req.user.schoolId, employeeId:req.user._id })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const updateExpense = async (req, res, next) => {
  try {
    const data = await expenseService.update(req.params.id, req.body, req.user.schoolId)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}



export const findandfilterExpense = async (req, resp, next) => {
  try {
    let filter = {
      is_deleted: false,
      schoolId: new ObjectId(req.user.schoolId),
    };

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
          description: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
      ];
    }

    const expense = await expenseService.findandfilterExpense(
      filter,
      options,
    );

    resp.status(200).json({ status: 200, data: expense });
  } catch (error) {
    console.log(error)
    return next(createError(error.status || 500, error.message));
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const data = await expenseService.delet(req.params.id, req.user.schoolId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
