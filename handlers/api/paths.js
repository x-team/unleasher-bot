import request from 'request-promise'

const PATH_DEFAULT_ID = 'unleasher-bot-path'
const STATUS_IN_PROGRESS = 'in-progress'
const STATUS_ACHIEVED = 'achieved'

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

const listUnachievedGoals = async function(userId) {
  let goals = await listGoals(userId)

  let unachievedGoals = []
  goals.forEach((goal) => {
    if (goal.status !== STATUS_ACHIEVED) {
      unachievedGoals.push(goal)
    }
  })

  return unachievedGoals
}

const getCurrentGoal = async function(userId) {
  let goals = await listGoals(userId)

  let currentGoal = null
  goals.forEach((goal) => {
    if (goal.status === STATUS_IN_PROGRESS) {
      currentGoal = goal
    }
  })

  return currentGoal
}

const achieveGoal = async function(userId, goal) {
  goal.achieved = true
  goal.status = STATUS_ACHIEVED

  return await updateGoal(userId, goal)
}

const postponeGoal = async function(userId, goal) {
  const firstDay = new Date();
  const nextWeek = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000)
  goal.dueDate = nextWeek.toISOString().substring(0, 10)

  return await updateGoal(userId, goal)
}

const updateGoal = (userId, goal) => {
  const options = {
      method: 'PUT',
      uri: `${process.env.paths_api_url}/${userId}/${PATH_DEFAULT_ID}-${userId}/goals/${goal.id}`,
      body: goal,
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
  listUnachievedGoals,
  createGoal,
  postponeGoal,
  achieveGoal,
  getCurrentGoal,
  STATUS_IN_PROGRESS,
}
