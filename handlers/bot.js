import Botkit from 'botkit'
import { startUnleashConvo } from './bot/conversations/startUnleash'
import { startIntroductionConvo } from './bot/conversations/introduction'
import { startWeeklyConvo } from './bot/conversations/weeklyUnleash'
import { getCurrentGoal } from './api/paths'

let bots = []

const listener = Botkit.slackbot({
  debug: true,
  stats_optout: false
})

const createNewBotConnection = (token) => {
  const bot = listener.spawn({ token: token.token }).startRTM()
  bots[token.team] = bot

  return bot
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
  bot.startConversation(message, (err, convo) => startIntroductionConvo(convo))
}

const weeklyStatusUpdate = (user) => {
  let bot = createNewBotConnection({
    token: process.env.slack_bot_token,
  })
  let message = {user: user.id}
  bot.startPrivateConversation(message, (err, convo) => startUnleashConvo(bot, message, convo))
}

export {
  listener,
  createNewBotConnection,
  resumeAllConnections,
  hiBack,
  introduceUnleash,
  weeklyStatusUpdate
}
