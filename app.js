import bodyParser from 'body-parser'
import express from 'express'
import routerControllers from './controllers'
import routerViews from './views'
import trello from 'node-trello'
import * as botHandler from './handlers/bot'
import * as storeHandler from './handlers/store'
import { translateUserIdToName } from './handlers/api/slack'

const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', routerControllers)
app.use('/', routerViews)
app.listen(port, () => {
  console.log(`listening at port ${port}`)
})

setupTeams()

async function setupTeams() {
  await storeHandler.init()
  await storeHandler.setupDevTeam()
  const trelloClient = new trello(process.env.trello_dev_key, process.env.trello_token)
  const trelloGuestClient = new trello(process.env.trello_guest_dev_key, process.env.trello_guest_token)
  const tokens = await storeHandler.getAllTokens()
  botHandler.resumeAllConnections(tokens)

  botHandler.listener.on('direct_message', async (bot, message) => {
    const creationSuccess = (err, data, message) => {
      trelloGuestClient.post(`/1/cards/${data.id}/actions/comments`, { text: message.text }, (err, data) => {
      })
      trelloClient.post('/1/webhooks/', {
        description: message.user,
        callbackURL: 'https://unleasher-bot-local.herokuapp.com/api/trello',
        idModel: data.id,
      }, (x, y) => {
      })
    }
    const username = botHandler.getUserName(message.team, message.user)
    const newCard = {
      name: username, 
      desc: JSON.stringify({team:message.team,userId:message.user}),
      idList: process.env.entry_list_id,
      pos: 'top'
    }
    trelloClient.post('/1/cards/', newCard, (err, data) => { creationSuccess(err, data, message) })
    
  })
}
