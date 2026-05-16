import mongoose from 'mongoose'
import paginate from "./plugins/paginatePlugins.js";


const ExpenseSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  expenseDate: { type: String, required: true },
  receiptNo: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'paid'], default: 'pending' },
  is_deleted: { type: Boolean, default: false },

}, { timestamps: true })

ExpenseSchema.plugin(paginate);

const Expense = mongoose.model('Expense', ExpenseSchema)
export default Expense
