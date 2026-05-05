import { createError } from "../configs/errorConfig.js";
import * as inventoryService from "../services/inventoryService.js";
import { pick } from "../middleware/validate.js";
import { Types } from "mongoose";
const { ObjectId } = Types;

export const getInventory = async (req, res, next) => {
  try {
    const data = await inventoryService.getAll({
      ...req.query,
      schoolId: req.user.schoolId,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createInventoryItem = async (req, res, next) => {
  try {
    const data = await inventoryService.create({
      ...req.body,
      schoolId: req.user.schoolId,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateInventoryItem = async (req, res, next) => {
  try {
    const data = await inventoryService.update(
      req.params.id,
      req.body,
      req.user.schoolId,
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const findandfilterInventory = async (req, resp, next) => {
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
        {
          category: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
      ];
    }

    const inventory = await inventoryService.findandfilterInventory(
      filter,
      options,
    );

    resp.status(200).json({ status: 200, data: inventory });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

export const deleteInventory = async (req, res, next) => {
  try {
    const data = await inventoryService.delet(req.params.id, req.user.schoolId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const inventoryAlerts = async (req, res, next) => {
  try {
    const data = await inventoryService.inventoryAlerts(req.user.schoolId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
