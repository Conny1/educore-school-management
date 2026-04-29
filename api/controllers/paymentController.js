import * as paymentService from '../services/paymentService.js'
import { createError } from "../configs/errorConfig.js";
import { pick } from '../middleware/validate.js';
import { Types } from 'mongoose';
const { ObjectId } = Types;


export const getPayments = async (req, res, next) => {
  try {
    const data = await paymentService.getAll({ ...req.query, schoolId: req.user.schoolId,})
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const createPayment = async (req, res, next) => {
  try {
    const data = await paymentService.create({ ...req.body, schoolId: req.user.schoolId,  recordedBy:req.user._id  })
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const deletePayment = async (req, res, next) => {
  try {
    await paymentService.remove(req.params.id, req.user.schoolId)
    res.json({ success: true, message: 'Payment deleted' })
  } catch (err) {
    next(err)
  }
}

export const findandfilterPayments = async (req, resp, next) => {
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
          receiptNo: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
      ];
    }

    const payment = await paymentService.findandfilterPayments(
      filter,
      options,
    );

    resp.status(200).json({ status: 200, data: payment });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};



export const getStudentBalance = async (req, res, next)=>{
    try {
    const data = await paymentService.getStudentBalance(req.params.studentid)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}