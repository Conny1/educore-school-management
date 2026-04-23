import mongoose from "mongoose";

const GradeRequirementSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    gradeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
      required: true,
    },
    itemName: { type: String, required: true },
    requiredQty: { type: Number, required: true },
    unit: { type: String, required: true },
    term: { type: String, required: true },
    year: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const GradeRequirement = mongoose.model(
  "GradeRequirement",
  GradeRequirementSchema,
);
export default GradeRequirement;
