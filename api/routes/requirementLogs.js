import express from 'express'
const router = express.Router()
import * as requirementLogController from '../controllers/requirementLogController.js'
import { checkAccess, verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createRequirementLogSchema } from '../validation/requirementLogValidation.js'

router.use(verifyTokens)
router.use(checkAccess )

router.get('/', requirementLogController.getRequirementLogs)
router.post('/', validate(createRequirementLogSchema), requirementLogController.createRequirementLog)

export default router
