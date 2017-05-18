import request from 'request-promise'

const PATH_DEFAULT_ID = 'unleasher-bot-path';

const listGoals = async function(userId) {
  const options = {
      uri: `${process.env.paths_api_url}/${userId}/${PATH_DEFAULT_ID}/goals`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      json: true,
  }
  let goals = await request(options)

  return goals
}

const createGoal = async function(userId, goal) {
  const options = {
      method: 'POST',
      uri: `${process.env.paths_api_url}/${userId}/${PATH_DEFAULT_ID}/goals`,
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
