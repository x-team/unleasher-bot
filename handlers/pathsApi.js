import request from 'request-promise'

const PATH_DEFAULT_ID = 'unleasher-bot-path';

const listGoals = (userId) => {
  const options = {
      uri: `${process.env.paths_api_url}/${userId}/${PATH_DEFAULT_ID}/goals`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      json: true,
  };

  return request(options)
}

const createGoal = (userId, goal) => {
  const options = {
      method: 'POST',
      uri: `${process.env.paths_api_url}/${userId}/${PATH_DEFAULT_ID}/goals`,
      body: goal,
      json: true,
  };

  return request(options)
}

export {
  listGoals,
  createGoal,
}
