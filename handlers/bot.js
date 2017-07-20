import Botkit from 'botkit'
import { getTeamUsers } from './api/slack'
import { addCommentToCard } from './trello'

let bots = []
let users = []

const listener = Botkit.slackbot({
  debug: false,
  stats_optout: false
})

const createNewBotConnection = async (token) => {
  const bot = listener.spawn({ token: token.token }).startRTM()
  bots[token.team] = bot
  users[token.team] = await getTeamUsers(token.token)
}

const resumeAllConnections = (tokens) => {
  for ( const key in tokens ) {
    createNewBotConnection(tokens[key])
  }
}

const passReplyFromTrello = (team, userId, cardId, comment) => {
  bots[team].startPrivateConversation({user: userId}, (err, convo) => {
    convo.ask(comment, [
      {
        default: true,
        callback: (response, convo) => {
          addCommentToCard(cardId, response.text)
        }
      }
    ]);
    convo.activate()
  })
}

const getUserName = (teamId, userId) => {
  const teamUsers = users[teamId]
  let username = userId
  for (const key in teamUsers) {
      if (teamUsers[key].id === userId) {
        username = teamUsers[key].real_name
      }
  }

  return username
}

export {
  listener,
  createNewBotConnection,
  resumeAllConnections,
  getUserName,
  passReplyFromTrello,
}
