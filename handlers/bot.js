import Botkit from 'botkit'
import { startUnleashConvo } from './bot/conversations/startUnleash'
import * as pathsApi from './pathsApi'

let bots = []

const listener = Botkit.slackbot({
  debug: true,
  stats_optout: false
});

const createNewBotConnection = (token) => {
  const bot = listener.spawn({ token: token.token }).startRTM()
  bots[token.team] = bot
}

const resumeAllConnections = (tokens) => {
  for ( const key in tokens ) {
    createNewBotConnection(tokens[key])
  }
}

const startUnleashConversationWithUser = (bot, user) => {
  pathsApi.listGoals(user.userId).then((goals) => {
    let goalOptions = [
      {
        "text": "Create a new goal",
        "value": "create_new_goal"
      }
    ]
    goals.forEach((goal) => {
      goalOptions.push({
        "text": goal.name,
        "value": goal.id
      })
    })

    bot.startPrivateConversation({user}, (err, convo) => startUnleashConvo(bot, err, convo, goalOptions))
  })
}

const hiBack = (bot, user) => {
  startUnleashConversationWithUser(bot, user)
}

export {
  listener,
  createNewBotConnection,
  resumeAllConnections,
  hiBack,
}
