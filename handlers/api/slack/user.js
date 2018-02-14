import slack from 'slack-node'
import { getTeamAppToken } from '../../store'

const getUserData = async (user, team) => {
  const token = await getTeamAppToken(team)
  const slackClient = new slack(token)
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
