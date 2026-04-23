import Expense from '../models/Expense.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.category) query.category = filters.category
  if (filters.status) query.status = filters.status
  return await Expense.find(query)
    .populate('supplierId', 'name')
    .populate('employeeId', 'firstName lastName')
}

export const create = async (data) => {
  return await Expense.create(data)
}

export const update = async (id, data, schoolId) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true }
  )
  if (!expense) throw new Error('Expense not found')
  return expense
}



export const findandfilterExpense = async (filter, options) => {
  const expense = await Expense.paginate(filter, options);
  if (!expense) {
    throw createError(404, "expense not found.");
  }
  return expense;
};

export const delet = async (id, schoolId) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: id, schoolId },
    {is_deleted:true},
    { new: true, runValidators: true }
  )
  if (!expense) throw new Error('expense not found')
  return expense
}


