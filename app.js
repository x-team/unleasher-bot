import bodyParser from 'body-parser'
import express from 'express'
import router from './controllers'
import * as botHandler from './handlers/bot'
import * as storeHandler from './handlers/store'

const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', router)
app.listen(port)

// sample usage of serverless Paths API
// pathsApi.createGoal('test', {
//   name: 'test',
//   description: 'test',
//   level: 1,
//   icon: 'test',
//   dueDate: new Date(),
// }).then((response) => {console.log(response)})
//
// pathsApi.listGoals('test').then((response) => {console.log(response)})

setupTeams()

async function setupTeams() {
  await storeHandler.init()
  await storeHandler.setupDevTeam()
  const tokens = await storeHandler.getAllTokens()
  botHandler.resumeAllConnections(tokens)
  // To-Do: fill in the keywords for the bot to listen to
  const keywords = [];
  botHandler.listener.hears(keywords, ['ambient'], (bot, message) => {
    // start conversation
  })
}
