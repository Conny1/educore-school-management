import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Department = mongoose.model("Department", DepartmentSchema);
export default Department;
