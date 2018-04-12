import { switchGoal, createGoal, achieveCurrentGoal, postponeCurrentGoal } from '../handlers/api/paths'
import { formatGoalDueDate, formatInteractiveComponent } from '../util/formatter'
import { dateNextWeekISO } from '../util/date'
import { openDialog } from '../handlers/api/slack/dialog'
import { sendResponseToMessage, sendChatMessage, sendChannelMessage } from '../handlers/api/slack/chat'
import { getUserData } from '../handlers/api/slack/user'
import { IM_CREATE_UNLEASH_GOAL } from '../handlers/bot/conversations/createUnleashGoal'
import { IM_START_UNLEASH, IM_UNLEASH_STATUS_UPDATE } from '../handlers/bot/conversations/weeklyUnleash'
import { IM_POST_GOAL_CREATED, IM_POST_GOAL_COMPLETED, IM_POST_GOAL_SWITCHED } from '../util/formatter'


const handleGoalCreated = async (payload) => {
    const name = payload.submission.goal_name
    const description = payload.submission.goal_description
    const dueDate = formatGoalDueDate(dateNextWeekISO())
    const level = 1
    const icon = 'home'
    const achieved = false
    const goal = { name, description, dueDate, level, icon, achieved }
    const createdGoal = await createGoal(payload.user.id, goal)
    const data = { callbackId: IM_POST_GOAL_CREATED.callbackId, goalId: createdGoal.id }
    const attachments = formatInteractiveComponent(data)
    await sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))
}

const handleSwitchGoal = async (payload) => {
    const response = 'Great! You can see the details of your current goal below. Talk soon. Good luck!'
    const goalId = payload.actions[0].selected_options[0].value
    const userId = payload.user.id
    const goal = await switchGoal(userId, goalId)
    let data = goal
    data.callbackId = IM_POST_GOAL_SWITCHED.callbackId
    const attachments = formatInteractiveComponent(data)
    await sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))

    return response
}

const handleSetGoalInProgress = async (payload) => {
    const response = 'Great! You can see the details of your current goal below. Talk soon. Good luck!'
    const goalId = payload.actions[0].value
    const userId = payload.user.id
    const goal = await switchGoal(userId, goalId)
    let data = goal
    data.callbackId = IM_POST_GOAL_SWITCHED.callbackId
    const attachments = formatInteractiveComponent(data)
    await sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))

    return response
}

const handleContactUnleasher = async (payload) => {
    const response = 'OK! I notified Unleashers. They should contact you shortly. And I ... I will gof for a nap ... :sleeping:'
    await sendChannelMessage(process.env.unleashers_channel, payload.team.id, `Hi. <@${payload.user.id}> has requested unleasher.`)

    return response
}

const handleGoalCompleted = async (payload) => {
    const response = 'Awesome! Congrats! :sparkles: :tada: :cake: \nWhenever you feel ready ping me in here to plan your next step.'
    let data = await achieveCurrentGoal(payload.user.id)
    data.callbackId = IM_POST_GOAL_COMPLETED.callbackId
    data.userId = payload.user.id
    data.userData = await getUserData(payload.user.id)
    const attachments = formatInteractiveComponent(data)
    await sendChannelMessage(process.env.unleash_channel, payload.team.id, null, JSON.stringify(attachments))

    return response
}

const handleOpenCreateGoalDialog = async (payload) => {
    await openDialog(payload.team.id, payload.trigger_id)
    await sendResponseToMessage(payload.response_url, 'Opening `Create Goal` dialog ...')
}

const handlePostponeGoal = async (payload) => {
    const response = 'Ok I added another week to this. I will bug you in 7 day. Stay positive!'
    await postponeCurrentGoal(payload.user.id)

    return response
}

const handleUnleashStatusUpdateChoice = (payload) => {
    let response = ''
    switch (parseInt(payload.actions[0].name)) {
    case IM_UNLEASH_STATUS_UPDATE.actions.goalCompleted:
        response =  handleGoalCompleted(payload)
        break

    case IM_UNLEASH_STATUS_UPDATE.actions.postponeGoal:
        response = handlePostponeGoal(payload)
        break

    case IM_UNLEASH_STATUS_UPDATE.actions.switchGoal:
        response = handleSwitchGoal(payload)
        break

    case IM_UNLEASH_STATUS_UPDATE.actions.contactUnleasher:
        response = handleContactUnleasher(payload)
        break

    default:
        response = `Unsupported action name: ${payload.actions[0].name} - contact admin.`
        break
    }

    return response
}

const handlePostGoalCreatedChoice = async (payload) => {
    let response = ''
    switch (parseInt(payload.actions[0].name)) {
    case IM_POST_GOAL_CREATED.actions.createNew:
        response = handleOpenCreateGoalDialog(payload)
        break

    case IM_POST_GOAL_CREATED.actions.setInProgress:
        response = handleSetGoalInProgress(payload)
        break

    case IM_POST_GOAL_CREATED.actions.doNothing:
        response = 'No worries. Will ping you next week. Talk later! :rocket:'
        break

    default:
        response = `Unsupported action name: ${payload.actions[0].name} - contact admin.`
        break
    }

    return response
}

const handleSelectOrCreateGoalChoice = (payload) => {
    let response = ''
    switch (parseInt(payload.actions[0].name)) {
    case IM_START_UNLEASH.actions.createNew:
        response = handleOpenCreateGoalDialog(payload)
        break

    case IM_START_UNLEASH.actions.chooseExising:
        response = handleSwitchGoal(payload)
        break

    case IM_START_UNLEASH.actions.contactUnleasher:
        response = handleContactUnleasher(payload)
        break
    
    case IM_START_UNLEASH.actions.doNothing:
        response = 'No worries. Will ping you next week. Talk later! :rocket:'
        break

    default:
        response = `Unsupported action name: ${payload.actions[0].name} - contact admin.`
        break
    }

    return response
}

const handleCreateUnleashGoalChoice = async (payload) => {
    let response = ''
    switch (parseInt(payload.actions[0].name)) {
    case IM_CREATE_UNLEASH_GOAL.actions.createGoal:
        response = await handleOpenCreateGoalDialog(payload)
        break

    case IM_CREATE_UNLEASH_GOAL.actions.contactUnleasher:
        response = await handleContactUnleasher(payload)
        break

    case IM_CREATE_UNLEASH_GOAL.actions.doNothing:
        response = 'No worries. Will ping you next week. Talk later! :rocket:'
        break

    default:
        response = `Unsupported action name: ${payload.actions[0].name} - contact admin.`
        break
    }

    return response
}

export {
    handleCreateUnleashGoalChoice,
    handleGoalCreated,
    handleSelectOrCreateGoalChoice,
    handlePostGoalCreatedChoice,
    handleUnleashStatusUpdateChoice,
}