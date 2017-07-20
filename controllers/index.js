import express from 'express'
import authController from './auth'
import wakeController from './wake'
import interactiveMessagesController from './interactiveMessages'
import trelloController from './trello'

const router = new express.Router()

router.use(authController)
router.use(wakeController)
router.use(interactiveMessagesController)
router.use(trelloController)

export default router
