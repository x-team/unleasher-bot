import Botkit from 'botkit'
import { startUnleashConvo, startIntroductionConvo } from './bot/conversations/startUnleash'
import * as pathsApi from './api/pathsApi'

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

const hiBack = (bot, message) => {
  bot.startPrivateConversation(message, (err, convo) => startUnleashConvo(bot, message, convo))
}

const introduceUnleash = (bot, message) => {
  bot.startConversation(message, startIntroductionConvo)
}

export {
  listener,
  createNewBotConnection,
  resumeAllConnections,
  hiBack,
  introduceUnleash,
}
