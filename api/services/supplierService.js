import Supplier from '../models/Supplier.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  return await Supplier.find(query)
}

export const create = async (data) => {
  return await Supplier.create(data)
}

export const update = async (id, data, schoolId) => {
  const supplier = await Supplier.findOneAndUpdate(
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true }
  )
  if (!supplier) throw new Error('Supplier not found')
  return supplier
}

export const findandfilterSuppliers = async (filter, options) => {
  const supplier = await Supplier.paginate(filter, options);
  if (!supplier) {
    throw createError(404, "supplier not found.");
  }
  return supplier;
};

export const delet = async (id, data, schoolId) => {
  const supplier = await Supplier.findOneAndUpdate(
    { _id: id, schoolId },
    {is_deleted:true},
    { new: true, runValidators: true }
  )
  if (!supplier) throw new Error('Supplier not found')
  return supplier
}
