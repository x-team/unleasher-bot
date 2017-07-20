import express from 'express'
import { passReplyFromTrello } from '../handlers/bot'
const router = new express.Router()

router.get('/trello', async function (req, res) {
  res.send('Thanks!')
})

router.post('/trello', async function (req, res) {
  if (req.body.action.memberCreator.username === 'jaceklawniczak' && req.body.action.type === 'commentCard') {
    const replyComment = req.body.action.data.text
    const meta = JSON.parse(req.body.model.desc)
    const cardId = req.body.model.id
    passReplyFromTrello(meta.team, meta.userId, cardId, replyComment)
  }
  
  res.send('Thanks!')
})

export default router
