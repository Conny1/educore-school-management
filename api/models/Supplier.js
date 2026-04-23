import mongoose from "mongoose";
import paginate from "./plugins/paginatePlugins.js"


const SupplierSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    is_deleted: { type: String, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true },
);
SupplierSchema.plugin(paginate);

const Supplier = mongoose.model("Supplier", SupplierSchema);
export default Supplier;
