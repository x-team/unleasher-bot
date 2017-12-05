import slack from 'slack-node'

const getUserData = async (user, team) => {
  const slackClient = new slack(process.env.slack_api_token)
  return new Promise((resolve, reject) => {
    slackClient.api('users.profile.get', { user }, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

export {
  getUserData
}
