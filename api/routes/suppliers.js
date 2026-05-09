import express from 'express'
const router = express.Router()
import * as supplierController from '../controllers/supplierController.js'
import { checkAccess, verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createSupplierSchema, findandfilter } from '../validation/logisticsValidation.js'

router.use(verifyTokens)
router.use(checkAccess )

router.get('/', supplierController.getSuppliers)
router.post('/', validate(createSupplierSchema), supplierController.createSupplier)
router.put('/:id', supplierController.updateSupplier)
router.post('/findandfilter', validate(findandfilter), supplierController.findandfilterSuppliers)
router.delete('/:id', supplierController.deleteSupplier)


export default router
