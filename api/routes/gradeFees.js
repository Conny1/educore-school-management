import express from 'express'
const router = express.Router()
import * as gradeFeeController from '../controllers/gradeFeeController.js'
import { checkAccess, verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createGradeFeeSchema, updateGradeFeeSchema } from '../validation/gradeFeeValidation.js'

router.use(verifyTokens)
router.use(checkAccess )


router.get('/', gradeFeeController.getGradeFees)
router.post('/', validate(createGradeFeeSchema), gradeFeeController.createGradeFee)
router.put('/:id', validate(updateGradeFeeSchema), gradeFeeController.updateGradeFee)
router.delete('/:id', gradeFeeController.deleteGradeFee)

export default router
