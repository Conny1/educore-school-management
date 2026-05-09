import express from 'express'
const router = express.Router()
import * as schoolController from '../controllers/schoolController.js'
import { checkAccess, verifyTokens } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import {  findandfilter } from '../validation/logisticsValidation.js'
import { createSchoolValidation } from '../validation/schoolValidation.js'

router.use(verifyTokens)
router.use(checkAccess )

router.get('/', schoolController.getSchools)
router.get('/:id', schoolController.getSchoolById)
router.post('/', validate(createSchoolValidation), schoolController.createSchool)
router.put('/:id', schoolController.updateSchool)
router.post('/findandfilter', validate(findandfilter),  schoolController.findandfilterSchool)

export default router
