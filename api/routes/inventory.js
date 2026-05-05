import express from 'express'
const router = express.Router()
import * as inventoryController from '../controllers/inventoryController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createInventorySchema, findandfilter } from '../validation/logisticsValidation.js'

router.use(verifyTokens)
router.get('/', inventoryController.getInventory)
router.post('/', validate(createInventorySchema), inventoryController.createInventoryItem)
router.put('/:id', inventoryController.updateInventoryItem)
router.post('/findandfilter',validate(findandfilter), inventoryController.findandfilterInventory)
router.delete('/:id', inventoryController.deleteInventory)
router.get('/alerts', inventoryController.inventoryAlerts)

export default router
