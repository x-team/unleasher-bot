import Botkit from 'botkit'

const bots = []

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

export {
  listener,
  createNewBotConnection,
  resumeAllConnections,
}
