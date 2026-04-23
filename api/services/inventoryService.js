import InventoryItem from '../models/InventoryItem.js'

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId }
  if (filters.category) query.category = filters.category
  return await InventoryItem.find(query).populate('supplierId', 'name')
}

export const create = async (data) => {
  return await InventoryItem.create(data)
}

export const update = async (id, data, schoolId) => {
  const item = await InventoryItem.findOneAndUpdate(
    { _id: id, schoolId },
    data,
    { new: true, runValidators: true }
  )
  if (!item) throw new Error('Inventory item not found')
  return item
}

export const findandfilterInventory = async (filter, options) => {
  const inventory = await InventoryItem.paginate(filter, options);
  if (!inventory) {
    throw createError(404, "inventory not found.");
  }
  return inventory;
};

export const delet = async (id, schoolId) => {
  const inventory = await InventoryItem.findOneAndUpdate(
    { _id: id, schoolId },
    {is_deleted:true},
    { new: true, runValidators: true }
  )
  if (!inventory) throw new Error('inventory not found')
  return inventory
}

