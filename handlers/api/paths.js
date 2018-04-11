import request from 'request-promise'
import errors from 'request-promise/errors'
import { dateNextWeekISO } from '../../util/date'
import { formatGoalDueDate } from '../../util/formatter'

const PATH_DEFAULT_ID = 'unleasher-bot-path'
const STATUS_IN_PROGRESS = 'in-progress'
const STATUS_ACHIEVED = 'achieved'
const STATUS_SKIPPED = 'skipped'

const listGoals = (userId) => {
    const options = {
        uri: `${process.env.paths_api_url}/${userId}/${PATH_DEFAULT_ID}-${userId}/goals`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        json: true,
    }

    const result = request(options).catch(errors.StatusCodeError, (reason) => {
        return []
    })

    return result
}

const listUnachievedAndIdleGoals = async function(userId) {
    let goals = await listGoals(userId)
    let unachievedGoals = []
    goals.forEach((goal) => {
        if (goal.status !== STATUS_ACHIEVED && goal.status !== STATUS_IN_PROGRESS) {
            unachievedGoals.push(goal)
        }
    })

    return unachievedGoals
}

const getGoalById = async function(userId, goalId) {
    let goals = await listGoals(userId)

    let searchedGoal = null
    goals.forEach((goal) => {
        if (goal.id === goalId) {
            searchedGoal = goal
        }
    })

    return searchedGoal
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

const achieveCurrentGoal = async (userId) => {
    const currentGoal = await getCurrentGoal(userId)
    return achieveGoal(userId, currentGoal)
}

const postponeGoal = async function(userId, goal) {
    goal.dueDate = formatGoalDueDate(dateNextWeekISO())
    goal.status = STATUS_IN_PROGRESS

    return await updateGoal(userId, goal)
}

const postponeCurrentGoal = async (userId) => {
    const currentGoal = await getCurrentGoal(userId)
    postponeGoal(userId, currentGoal)
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

const switchGoal = async (userId, goalId) => {
    try {
        const oldGoal = await getCurrentGoal(userId)
        if (oldGoal) {
            const goalSkipped = await skipGoal(userId, oldGoal)
        }
        const newGoal = await getGoalById(userId, goalId)
        return await postponeGoal(userId, newGoal)
    } catch (e) {
        console.log('switch goal exception: ', e)
        return false
    }
}

const skipGoal = async function(userId, goal) {
    goal.dueDate = null
    goal.status = STATUS_SKIPPED

    return await updateGoal(userId, goal)
}

const createGoal = async function(userId, goal) {
    const options = {
        method: 'POST',
        uri: `${process.env.paths_api_url}/${userId}/${PATH_DEFAULT_ID}-${userId}/goals`,
        body: goal,
        json: true,
    }
    let createdGoal = await request(options).catch(error => {
        console.log('Create goal exception: ', error)
    })

    return createdGoal
}

export {
    listGoals,
    listUnachievedAndIdleGoals,
    createGoal,
    postponeGoal,
    achieveGoal,
    postponeCurrentGoal,
    achieveCurrentGoal,
    skipGoal,
    switchGoal,
    getCurrentGoal,
    STATUS_IN_PROGRESS,
}
