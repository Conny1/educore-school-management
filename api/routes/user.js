import express from 'express'
const router = express.Router()
import * as userController from '../controllers/userController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createSupplierSchema, findandfilter } from '../validation/logisticsValidation.js'
import { createUser } from '../validation/userValidation.js'

router.use(verifyTokens)
router.get('/', userController.getUsers)
router.post('/', validate(createUser), userController.createUser)
router.put('/:id', userController.updateUser)
router.post('/findandfilter', validate(findandfilter), userController.findandfilterUser)
router.delete('/:id', userController.deleteUser)


export default router
