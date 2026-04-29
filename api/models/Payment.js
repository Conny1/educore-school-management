import mongoose from "mongoose";
import paginate from "./plugins/paginatePlugins.js";

const PaymentSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    gradeFeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GradeFee",
      required: true,
    },
    receiptNo: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentFor: { type: String, required: true },
    method: {
      type: String,
      enum: ["cash", "mpesa", "bank_transfer", "cheque"],
      required: true,
    },
    reference: { type: String, default: "" },
    paidAt: { type: String, required: true },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

PaymentSchema.index({ schoolId: 1, receiptNo: 1 }, { unique: true });

PaymentSchema.plugin(paginate);

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
