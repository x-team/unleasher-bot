import express from 'express'
import requestParser from './middleware/interactiveComponentRequestType'

const router = new express.Router()

router.post('/im', requestParser, (req, res) => {
    res.locals.respond ? res.status(200).send(res.locals.message) : res.end()
})

export default router
