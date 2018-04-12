import express from 'express'
import authController from './auth'
import interactiveComponentController from './interactiveComponent'
import commandController from './command'

const router = new express.Router()

router.use(authController)
router.use(interactiveComponentController)
router.use(commandController)

export default router
