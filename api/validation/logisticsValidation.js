import Joi from 'joi'

export const createSupplierSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    contactPerson: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    category: Joi.string().required(),
    status: Joi.string().valid('active', 'inactive')
  })
}

export const createExpenseSchema = {
  body: Joi.object({
    supplierId: Joi.string().allow(null),
    description: Joi.string().required(),
    category: Joi.string().required(),
    amount: Joi.number().required(),
    expenseDate: Joi.string().required(),
    receiptNo: Joi.string().required(),
    status: Joi.string().valid('pending', 'approved', 'paid')
  })
}

export const createInventorySchema = {
  body: Joi.object({
    supplierId: Joi.string().required(),
    name: Joi.string().required(),
    category: Joi.string().required(),
    quantity: Joi.number().required(),
    reorderLevel: Joi.number().required(),
    unitCost: Joi.number().required(),
    unit: Joi.string().required(),
    lastUpdated: Joi.string().required()
  })
}

export const createProjectSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    budget: Joi.number().required(),
    status: Joi.string().valid('planning', 'active', 'on_hold', 'completed', 'cancelled'),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    managedBy: Joi.string().required()
  })
}

export const findandfilter = {
  body: Joi.object().keys({
    sortBy: Joi.string().allow("", null).default(""),
    limit: Joi.number().default(10),
    page: Joi.number().default(0),
    search: Joi.string().allow("", null).default(""),
    match_values: Joi.object().allow(null).default(null),
  }),
};

