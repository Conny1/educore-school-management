import * as gradeService from "../services/gradeService.js";
import { createError } from "../configs/errorConfig.js";
import * as employeeService from "../services/employeeService.js";
import { pick } from "../middleware/validate.js";
import { Types } from "mongoose";
const { ObjectId } = Types;

export const getGrades = async (req, res, next) => {
  try {
    const data = await gradeService.getAll({
      ...req.query,
      schoolId: req.user.schoolId,
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getGradeById = async (req, res, next) => {
  try {
    const data = await gradeService.getById(req.params.id, req.user.schoolId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createGrade = async (req, res, next) => {
  try {
    const data = await gradeService.create({
      ...req.body,
      schoolId: req.user.schoolId,
    });
    if (data && data.classTeacherId) {
      await employeeService.update(
        data.classTeacherId,
        { gradeId: data._id },
        req.user.schoolId,
      );
    }
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateGrade = async (req, res, next) => {
  try {
    const data = await gradeService.update(
      req.params.id,
      req.body,
      req.user.schoolId,
    );

    if (data && data.classTeacherId) {
      await employeeService.update(
        data.classTeacherId,
        { gradeId: data._id },
        req.user.schoolId,
      );
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const deleteGrade = async (req, res, next) => {
  try {
    await gradeService.remove(req.params.id, req.user.schoolId);
    res.json({ success: true, message: "Grade deleted" });
  } catch (err) {
    next(err);
  }
};

export const findandfilterGrade = async (req, resp, next) => {
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
          name: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
      ];
    }

    const grades = await gradeService.findandfilterGrade(filter, options);

    resp.status(200).json({ status: 200, data: grades });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};
