import bodyParser from 'body-parser'
import express from 'express'
import router from './controllers'
import * as botHandler from './handlers/bot'
import * as storeHandler from './handlers/store'
import * as pathsApi from './handlers/pathsApi'

const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', router)
app.listen(port)

setupTeams()

async function setupTeams() {
  await storeHandler.init()
  await storeHandler.setupDevTeam()
  const tokens = await storeHandler.getAllTokens()
  botHandler.resumeAllConnections(tokens)
  botHandler.listener.on('direct_message', (bot, message) => {
    botHandler.hiBack(bot, message.user)
  })
  botHandler.listener.hears(['hi', 'Hello'], 'mention', (bot, message) => {
    botHandler.introduceUnleash(bot, message)
  })
}
