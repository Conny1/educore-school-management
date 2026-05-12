import * as notificationService from "../services/notificationService.js"
import {createError} from "../configs/errorConfig.js"
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// Add New Notification Settings
export const createNotification = async (req, resp, next) => {
  try {
    await notificationService.createNotification(req.body);
    resp.status(200).json({ success: true, data: { message: "Notification" } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};




export const resetPasswordlink = async (req, resp, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) next(createError(401, "Invalid email account"));
    const token = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "1h" }, // token valid for 1 hour
    );
    let reset_link = `${process.env.APP_URL}/reset-password/${token}`;

    await notificationService.resetPasswordlink(user.email, {
      user_name: user.name,
      reset_link,
      user_id: user._id,
      schoolId: user.schoolId,
    });


    resp.status(200).json({ success: true  });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};


