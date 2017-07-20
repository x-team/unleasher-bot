import express from 'express'

const router = new express.Router()

router.post('/im', async function (req, res) {
  if (req.body.payload) {
    const payload = JSON.parse(req.body.payload)
    if (payload.actions[0].type === 'select') {
      console.log('select')
    }
  }
  res.send('Thanks!')
})

export default router
