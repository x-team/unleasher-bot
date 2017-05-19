import Botkit from 'botkit'
import { startUnleashConvo } from './bot/conversations/startUnleash'

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
  bot.startPrivateConversation({user}, (err, convo) => startUnleashConvo(bot, err, convo))
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
