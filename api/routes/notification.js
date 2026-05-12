import express from "express"
import * as notificationController from "../controllers/notificationController.js"
import { validate } from "../middleware/validate.js";
import { resetPassword } from "../validation/notificationValidation.js";

const route = express.Router();

route.post(
  "/reset-password-link-email",
  validate(resetPassword),
  notificationController.resetPasswordlink
);



export default route