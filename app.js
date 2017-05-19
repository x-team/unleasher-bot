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

// sample usage of serverless Paths API
// let goal = pathsApi.createGoal('test', {
//   name: 'test',
//   description: 'test',
//   level: 1,
//   icon: 'test',
//   dueDate: new Date(),
// })
// let goals = pathsApi.listGoals('test')

setupTeams()

async function setupTeams() {
  await storeHandler.init()
  await storeHandler.setupDevTeam()
  const tokens = await storeHandler.getAllTokens()
  botHandler.resumeAllConnections(tokens)
  botHandler.listener.hears('hi', 'direct_message', (bot, message) => {
    botHandler.hiBack(bot, message.user)
  })
  botHandler.listener.hears('Hello', 'mention', (bot, message) => {
    botHandler.hiBack(bot, message.user)
  })
}
