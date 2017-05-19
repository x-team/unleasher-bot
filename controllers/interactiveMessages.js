import express from 'express'

const router = new express.Router()

router.post('/im', async function (req, res) {
  if (req.body.payload) {
    const payload = JSON.parse(req.body.payload)
    if (payload.actions[0].type === 'select') {
      const goalId = payload.actions[0].selected_options[0].value
      const userId = payload.user.id
      console.log(`[IM controller] User ${userId} has selected goal ${goalId}`)
    }
  }
  res.send('Thanks!')
})

export default router
