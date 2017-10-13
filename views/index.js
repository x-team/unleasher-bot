import express from 'express'

const router = new express.Router()

router.get('/', (req,res) => {
    res.sendFile(`${__dirname}/index.html`)
})

export default router
