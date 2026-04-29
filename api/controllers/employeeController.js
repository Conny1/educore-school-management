import * as employeeService from "../services/employeeService.js";
import { createError } from "../configs/errorConfig.js";
import * as inventoryService from "../services/inventoryService.js";
import * as gradeService from "../services/gradeService.js";

import { pick } from "../middleware/validate.js";
import { Types } from "mongoose";
const { ObjectId } = Types;

export const getEmployees = async (req, res, next) => {
  try {
    const data = await employeeService.getAll({
      ...req.query,
      schoolId: req.user.schoolId,
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const data = await employeeService.getById(
      req.params.id,
      req.user.schoolId,
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const data = await employeeService.create({
      ...req.body,
      schoolId: req.user.schoolId,
    });
    if (data && data.gradeId) {
      await gradeService.update(
        data.gradeId,
        { classTeacherId: data._id },
        req.user.schoolId,
      );
    }
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const data = await employeeService.update(
      req.params.id,
      req.body,
      req.user.schoolId,
    );
       if (data && data.gradeId) {
      await gradeService.update(
        data.gradeId,
        { classTeacherId: data._id },
        req.user.schoolId,
      );
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    await employeeService.remove(req.params.id, req.user.schoolId);
    res.json({ success: true, message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
};

export const findandfilterEmployees = async (req, resp, next) => {
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
          firstName: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
        {
          lastName: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
        {
          email: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
        {
          phone: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
        {
          staffNo: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
         {
          role: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
      ];
    }
    const employees = await employeeService.findandfilterEmployee(
      filter,
      options,
    );

    resp.status(200).json({ status: 200, data: employees });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

 export const employeeStats =async (req,res,next)=>{
    try {
    const data = await employeeService.employeeStats(req.user.schoolId);
    res.json({ success: true, data});
  } catch (err) {
    next(err);
  }
}
