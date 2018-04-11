import express from 'express'
import requestParser from './middleware/interactiveComponentRequestType'

const router = new express.Router()

router.post('/im', requestParser, (req, res) => {
    res.locals.respond ? res.sendStatus(200) : res.end()
})

export default router
