import express from 'express'
const router = express.Router()
import * as projectController from '../controllers/projectController.js'
import { verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createProjectSchema, findandfilter } from '../validation/logisticsValidation.js'

router.use(verifyTokens)
router.get('/', projectController.getProjects)
router.post('/', validate(createProjectSchema), projectController.createProject)
router.put('/:id', projectController.updateProject)
router.post('/findandfilter', validate(findandfilter),  projectController.findandfilterProjects)

export default router
