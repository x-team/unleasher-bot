import slack from 'slack-node'

const getUserData = async (user) => {
    const slackClient = new slack(process.env.slack_api_token)
    return new Promise((resolve, reject) => {
        slackClient.api('users.profile.get', { user }, (err, response) => {
            console.log('users.profile.get', err, response)
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
