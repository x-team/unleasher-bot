import slack from 'slack-node'
import * as errorUtil from '../../util/error'

const exchangeCodeForToken = (code) => {
  return new Promise((resolve, reject) => {
    const data = {
      client_id: process.env.slack_app_client_id,
      client_secret: process.env.slack_app_client_secret,
      code,
      redirect_uri: process.env.slack_app_redirect_uri,
    }
    const slackClient = new slack(process.env.slack_api_token)
    slackClient.api('oauth.access', data, (err, response) => {
      try {
        errorUtil.handleAuthResponse(response)
      } catch (e) {
        reject('invalid token')
      } finally {
        resolve(response)
      }
    })
  })
}

const getTeamUsers = (token) => {
  return new Promise((resolve, reject) => {
    const slackClient = new slack(token)
    slackClient.api('users.list', (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response.members)
      }
    })
  })
}

const identifyDevBotData = () => {
  return new Promise((resolve, reject) => {
    const slackClient = new slack(process.env.slack_bot_token)
    slackClient.api('auth.test', (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

export {
  exchangeCodeForToken,
  identifyDevBotData,
  getTeamUsers,
}
