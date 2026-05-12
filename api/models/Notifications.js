import mongoose from "mongoose";
import paginate from "./plugins/paginatePlugins.js";
const notificationSchema = mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: ["email", "SMS", "whatsapp", "Push"],
      default: "email",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: {},
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

const Notifications = mongoose.model("notifications", notificationSchema);
export default Notifications;