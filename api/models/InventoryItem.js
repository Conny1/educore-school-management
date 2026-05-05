import mongoose from "mongoose";
import paginate from "./plugins/paginatePlugins.js";

const InventoryItemSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    reorderLevel: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    unit: { type: String, required: true },
    lastUpdated: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true },
);
InventoryItemSchema.plugin(paginate);
const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema);
export default InventoryItem;
