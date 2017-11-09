import slack from 'slack-node'
import request from 'request-promise'

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
        json: true,
    }

  return request(options)
}

export {
  updateChatMessage,
  sendResponseToMessage
}
