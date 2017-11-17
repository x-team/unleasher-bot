import slack from 'slack-node'
import rp from 'request-promise'

import { getBotData } from '../../bot'

const updateChatMessage = (channel, team, ts, text, attachments) => {
  const botData = getBotData(team)
  const slackClient = new slack(botData.config.token)
  const data = { ts, channel, text , attachments}

  return new Promise((resolve, reject) => {
    slackClient.api('chat.update', data, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

const sendResponseToMessage = (uri, text) => {
  const options = {
    method: 'POST',
    uri,
    body: { text },
    json: true
  }
  return rp(options)
}

const sendChatMessage = (user, team, text, attachments) => {
  const botData = getBotData(team)
  const slackClient = new slack(botData.config.token)
  const data = {
    text,
    channel: `@${user}`,
    attachments,
    as_user: true
  }
  return new Promise((resolve, reject) => {
    slackClient.api('chat.postMessage', data, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

export {
  updateChatMessage,
  sendChatMessage,
  sendResponseToMessage
}
