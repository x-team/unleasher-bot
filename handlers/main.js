import { switchGoal, createGoal, achieveCurrentGoal, postponeCurrentGoal } from '../handlers/api/paths'
import { formatGoalDueDate, formatInteractiveComponent } from '../util/formatter'
import { dateNextWeekISO } from '../util/date'
import { openDialog } from '../handlers/api/slack/dialog'
import { sendResponseToMessage, sendChatMessage, sendChannelMessage } from '../handlers/api/slack/chat'
import { getUserData } from '../handlers/api/slack/user'
import interactiveComponent from '../models/interactiveComponent'
import { IM_CREATE_UNLEASH_GOAL } from '../handlers/bot/conversations/createUnleashGoal'
import { IM_START_UNLEASH, IM_UNLEASH_STATUS_UPDATE } from '../handlers/bot/conversations/weeklyUnleash'
import { IM_POST_GOAL_CREATED, IM_POST_GOAL_COMPLETED, IM_POST_GOAL_SWITCHED } from '../util/formatter'


const handleGoalCreated = async (payload) => {
    const name = payload.submission.goal_name
    const description = payload.submission.goal_description
    const dueDate = formatGoalDueDate(dateNextWeekISO())
    const level = interactiveComponent.DEFAULT_GOAL_LVL
    const icon = interactiveComponent.DEFAULT_GOAL_ICON
    const achieved = false
    const goal = { name, description, dueDate, level, icon, achieved }
    const createdGoal = await createGoal(payload.user.id, goal)
    const data = { callbackId: IM_POST_GOAL_CREATED.callbackId, goalId: createdGoal.id }
    const attachments = formatInteractiveComponent(data)
    sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))
}

const handleSwitchGoal = async (payload) => {
    const goalId = payload.actions[0].selected_options[0].value
    const userId = payload.user.id
    const goal = await switchGoal(userId, goalId)
    //res.status(200).send('Great! You can see the details of your current goal below. Talk soon. Good luck!')
    let data = goal
    data.callbackId = IM_POST_GOAL_SWITCHED.callbackId
    const attachments = formatInteractiveComponent(data)
    sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))
}

const handleSetGoalInProgress = async (payload) => {
    const goalId = payload.actions[0].value
    const userId = payload.user.id
    const goal = await switchGoal(userId, goalId)
    //res.status(200).send('Great! You can see the details of your current goal below. Talk soon. Good luck!')
    let data = goal
    data.callbackId = IM_POST_GOAL_SWITCHED.callbackId
    const attachments = formatInteractiveComponent(data)
    sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))
}

const handleContactUnleasher = async (payload) => {
    await sendChannelMessage(process.env.unleashers_channel, payload.team.id, `Hi. <@${payload.user.id}> has requested unleasher.`)
}

const handleGoalCompleted = async (payload) => {
    let data = await achieveCurrentGoal(payload.user.id)
    // res.status(200).send('Awesome! Congrats! :sparkles: :tada: :cake: \nWhenever you feel ready ping me in here to plan your next step.')
    data.callbackId = IM_POST_GOAL_COMPLETED.callbackId
    data.userId = payload.user.id
    data.userData = await getUserData(payload.user.id)
    const attachments = formatInteractiveComponent(data)
    console.log('ATTACHMENTS:', attachments)
    await sendChannelMessage(process.env.unleash_channel, payload.team.id, null, JSON.stringify(attachments))
}

const handleOpenCreateGoalDialog = async (payload) => {
    await openDialog(payload.team.id, payload.trigger_id)
    await sendResponseToMessage(payload.response_url, 'Opening `Create Goal` dialog ...')
}

const handlePostponeGoal = async (payload) => {
    await postponeCurrentGoal(payload.user.id)
    //res.status(200).send('Ok I added another week to this. I will bug you in 7 day. Stay positive!')
}

const handleUnleashStatusUpdateChoice = (payload) => {
    switch (parseInt(payload.actions[0].name)) {
    case IM_UNLEASH_STATUS_UPDATE.actions.goalCompleted:
        handleGoalCompleted(payload)
        break

    case IM_UNLEASH_STATUS_UPDATE.actions.postponeGoal:
        handlePostponeGoal(payload)
        break

    case IM_UNLEASH_STATUS_UPDATE.actions.switchGoal:
        handleSwitchGoal(payload)
        break

    case IM_UNLEASH_STATUS_UPDATE.actions.contactUnleasher:
        handleContactUnleasher(payload)
        break

    default:
        console.log('Unsupported action name: ', payload.actions[0].name)
        break
    }
}

const handlePostGoalCreatedChoice = async (payload) => {
    console.log(payload)
    switch (parseInt(payload.actions[0].name)) {
    case IM_POST_GOAL_CREATED.actions.createNew:
        handleOpenCreateGoalDialog(payload)
        break

    case IM_POST_GOAL_CREATED.actions.setInProgress:
        handleSetGoalInProgress(payload)
        break

    case IM_POST_GOAL_CREATED.actions.doNothing:
        console.log('post goal created do nothing')
        break

    default:
        console.log('Unsupported action name: ', payload.actions[0].name)
        break
    }
}

const handleSelectOrCreateGoalChoice = (payload) => {
    switch (parseInt(payload.actions[0].name)) {
    case IM_START_UNLEASH.actions.createNew:
        handleOpenCreateGoalDialog(payload)
        break

    case IM_START_UNLEASH.actions.chooseExising:
        handleSwitchGoal(payload)
        break

    case IM_START_UNLEASH.actions.contactUnleasher:
        handleContactUnleasher(payload)
        break
    
    case IM_START_UNLEASH.actions.doNothing:
        console.log('start unleash do nothing')
        break

    default:
        console.log('Unsupported action name: ', payload.actions[0].name)
        break
    }
}

const handleCreateUnleashGoalChoice = (payload) => {
    switch (parseInt(payload.actions[0].name)) {
    case IM_CREATE_UNLEASH_GOAL.actions.createGoal:
        handleOpenCreateGoalDialog(payload)
        break

    case IM_CREATE_UNLEASH_GOAL.actions.contactUnleasher:
        handleContactUnleasher(payload)
        break

    case IM_CREATE_UNLEASH_GOAL.actions.doNothing:
        console.log('create unleash goal do nothing')
        break

    default:
        console.log('Unsupported action name: ', payload.actions[0].name)
        break
    }
}

export {
    handleCreateUnleashGoalChoice,
    handleGoalCreated,
    handleSelectOrCreateGoalChoice,
    handlePostGoalCreatedChoice,
    handleUnleashStatusUpdateChoice,
}