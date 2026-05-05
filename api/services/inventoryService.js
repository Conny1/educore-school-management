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


export const inventoryAlerts = async ( schoolId) => {
const inventory = await InventoryItem.aggregate([
  {
    $match: {
      is_deleted: false, // Ensure we aren't looking at deleted items
      schoolId:schoolId,
      $expr: {
        $lte: ["$quantity", "$reorderLevel"] // Quantity <= Reorder Level
      }
    }
  },
  {
    // Optional: Sort by urgency (how far below reorder level they are)
    $addFields: {
      shortfall: { $subtract: ["$reorderLevel", "$quantity"] }
    }
  },
  {
    $sort: { shortfall: -1 }
  },
  {
    // Optional: Join with supplier info to know who to call
    $lookup: {
      from: "suppliers",
      localField: "supplierId",
      foreignField: "_id",
      as: "supplierDetails"
    }
  },
  {
    $unwind: {
      path: "$supplierDetails",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $project: {
      name: 1,
      quantity: 1,
      reorderLevel: 1,
      unit: 1,
      shortfall: 1,
      supplierName: "$supplierDetails.name",
      supplierContact: "$supplierDetails.phone"
    }
  }
]);

return  inventory
}

