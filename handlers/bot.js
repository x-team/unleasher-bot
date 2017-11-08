import Botkit from 'botkit'
import { startUnleashConvo } from './bot/conversations/startUnleash'
import { startIntroductionConvo } from './bot/conversations/introduction'
import { getTeamUsers } from './api/slack'
import { isUserInWhitelist } from './store'

let bots = []
let users = []

const listener = Botkit.slackbot({
    debug: false,
    stats_optout: false
})

const createNewBotConnection = (token) => {
    const bot = listener.spawn({ token: token.token }).startRTM()
    bots[token.team] = bot
    users[token.team] = getTeamUsers(token.token)
}

const resumeAllConnections = (tokens) => {
    for ( const key in tokens ) {
        createNewBotConnection(tokens[key])
    }
}

const getBotData = (teamId) => {
    return bots[teamId]
}

// When someone DM Unleasher Bot
const hiBack = (bot, message) => {
    bot.startPrivateConversation(message, (err, convo) => startUnleashConvo(bot, message, convo))
}

// When someone mentiones Unleasher Bot
const introduceUnleash = (bot, message) => {
    bot.startConversation(message, (err, convo) => startIntroductionConvo(convo))
}

// Weekly status update for all unleashees
const weeklyStatusUpdate = () => {
    for ( const team in bots ) {
        users[team].then((teamUsers) => {
            teamUsers.forEach((user) => {
                if (isUserInWhitelist(user.name)) {
                    let message = {user: user.id}
                    bots[team].startPrivateConversation(message, (err, convo) => startUnleashConvo(bots[team], message, convo))
                }
            })
        })
    }
}

export {
    listener,
    createNewBotConnection,
    resumeAllConnections,
    hiBack,
    introduceUnleash,
    weeklyStatusUpdate,
    getBotData
}
