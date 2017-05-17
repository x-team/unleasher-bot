import express from 'express'
import authController from './authController'
import wakeController from './wakeController'

const router = new express.Router()

router.use(authController)
router.use(wakeController)

export default router
