import request from 'request-promise'

const PATH_DEFAULT_ID = 'unleasher-bot-path';

const listGoals = (userId) => {
  const options = {
      uri: `${process.env.paths_api_url}/${userId}/${PATH_DEFAULT_ID}-${userId}/goals`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      json: true,
  }

  return request(options)
}

const createGoal = async function(userId, goal) {
  const options = {
      method: 'POST',
      uri: `${process.env.paths_api_url}/${userId}/${PATH_DEFAULT_ID}-${userId}/goals`,
      body: goal,
      json: true,
  }
  let createdGoal = await request(options)

  return createdGoal
}

export {
  listGoals,
  createGoal,
}
