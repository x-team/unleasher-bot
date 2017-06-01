import bodyParser from 'body-parser'
import express from 'express'
import routerControllers from './controllers'
import routerViews from './views'
import * as botHandler from './handlers/bot'
import * as storeHandler from './handlers/store'

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
  const tokens = await storeHandler.getAllTokens()
  botHandler.resumeAllConnections(tokens)
  botHandler.listener.on('direct_message', (bot, message) => {
    botHandler.hiBack(bot, message)
  })
  botHandler.listener.hears(['hi', 'Hello'], 'mention', (bot, message) => {
    botHandler.introduceUnleash(bot, message)
  })
}
