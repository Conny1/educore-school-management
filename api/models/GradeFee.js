import mongoose from "mongoose";

const GradeFeeSchema = new mongoose.Schema(
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
    term: {
      type: String,
      enum: ["Term 1", "Term 2", "Term 3"],
      required: true,
    },
    year: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const GradeFee = mongoose.model("GradeFee", GradeFeeSchema);
export default GradeFee;
