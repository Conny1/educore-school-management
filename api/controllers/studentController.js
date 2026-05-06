import * as studentService from "../services/studentService.js";
import { createError } from "../configs/errorConfig.js";
import * as inventoryService from "../services/inventoryService.js";
import { pick } from "../middleware/validate.js";
import { Types } from "mongoose";
const { ObjectId } = Types;

export const getStudents = async (req, res, next) => {
  try {
    const data = await studentService.getAll({
      ...req.query,
      schoolId: req.user.schoolId,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const data = await studentService.getById(req.params.id, req.user.schoolId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const data = await studentService.create({
      ...req.body,
      schoolId: req.user.schoolId,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const data = await studentService.update(
      req.params.id,
      req.body,
      req.user.schoolId,
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    await studentService.remove(req.params.id, req.user.schoolId);
    res.json({ success: true, message: "Student deleted" });
  } catch (err) {
    next(err);
  }
};

export const findandfilterStudents = async (req, resp, next) => {
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
        { firstName: { $regex: ".*" + req.body.search + ".*", $options: "i" } },
        { lastName: { $regex: ".*" + req.body.search + ".*", $options: "i" } },
        { gurdian: { $regex: ".*" + req.body.search + ".*", $options: "i" } },
        {
          admissionNo: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
      ];
    }
    const students = await studentService.findandfilterStudents(
      filter,
      options,
    );

    resp.status(200).json({ status: 200, data: students });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
}; 

export const getStudentTermlyFinancials = async (req, res, next) => {
  try {
    const data = await studentService.getStudentTermlyFinancials(req.params.studentId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};


export const getStudentRequirementStatus = async (req, res, next) => {
  try {
    const data = await studentService.getStudentRequirementStatus(req.params.studentId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
