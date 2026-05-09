import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "teacher", "finance", "management"],
      required: true,
    },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
export default User;
