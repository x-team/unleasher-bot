import express from 'express'

import { switchGoal, createGoal, achieveCurrentGoal, postponeCurrentGoal } from '../handlers/api/paths'
import { formatGoalDueDate, formatInteractiveComponent } from '../util/formatter'
import { dateNextWeekISO } from '../util/date'
import { openDialog } from '../handlers/api/slack/dialog'
import { sendResponseToMessage, sendChatMessage, sendChannelMessage } from '../handlers/api/slack/chat'
import { getUserData } from '../handlers/api/slack/user'
import * as interactiveComponent from '../models/interactiveComponent'

const router = new express.Router()

router.post('/im', async function (req, res) {
    if (req.body.payload) {
        const payload = JSON.parse(req.body.payload)
        if ( payload.type === interactiveComponent.IM_TYPE_DIALOG) {
            const name = payload.submission.goal_name
            const description = payload.submission.goal_description
            const dueDate = formatGoalDueDate(dateNextWeekISO())
            const level = interactiveComponent.DEFAULT_GOAL_LVL
            const icon = interactiveComponent.DEFAULT_GOAL_ICON
            const achieved = false
            const goal = { name, description, dueDate, level, icon, achieved }
            const createdGoal = await createGoal(payload.user.id, goal)
            res.status(200).send()
            const data = { callbackId: interactiveComponent.IM_MSG_TYPE_AFTER_GOAL_CREATED, goalId: createdGoal.id }
            const attachments = formatInteractiveComponent(data)
            sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))
        } else if ( payload.type === interactiveComponent.IM_TYPE_INTERACTIVE_MSG && payload.callback_id === interactiveComponent.IM_MSG_TYPE_CURRENT_GOAL) {
            const goalId = payload.actions[0].selected_options[0].value
            const userId = payload.user.id
            const goal = await switchGoal(userId, goalId)
            res.status(200).send('Great! You can see the details of your current goal below. Talk soon. Good luck!')
            let data = goal
            data.callbackId = interactiveComponent.IM_MSG_TYPE_AFTER_GOAL_SWITCHED
            const attachments = formatInteractiveComponent(data)
            sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))
        } else if ( payload.type === interactiveComponent.IM_TYPE_INTERACTIVE_MSG && payload.callback_id === interactiveComponent.IM_MSG_TYPE_CREATE_FIRST_GOAL) {
            if (payload.actions[0].name == interactiveComponent.GENERIC_YES) {
              openDialog(payload.team.id, payload.trigger_id)
              res.status(200).send()
              await sendResponseToMessage(payload.response_url, 'You selected `Create goal`. Thanks!')
            } else if (payload.actions[0].name == interactiveComponent.GENERIC_NO) {
              res.status(200).send({'text': interactiveComponent.MKTHX})
            }
        } else if ( payload.type === interactiveComponent.IM_TYPE_INTERACTIVE_MSG && payload.callback_id === interactiveComponent.IM_MSG_TYPE_SELECT_OR_CREATE) {
            if (payload.actions[0].type === interactiveComponent.IM_MENU_TYPE) {
                const goalId = payload.actions[0].selected_options[0].value
                const userId = payload.user.id
                const goal = await switchGoal(userId, goalId)
                res.status(200).send('Great! You can see the details of your current goal below. Talk soon. Good luck!')
                let data = goal
                data.callbackId = interactiveComponent.IM_MSG_TYPE_AFTER_GOAL_SWITCHED
                const attachments = formatInteractiveComponent(data)
                sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))
            } else if (payload.actions[0].type === interactiveComponent.IM_BUTTON_TYPE) {
                if (parseInt(payload.actions[0].value) === 1) {
                    openDialog(payload.team.id, payload.trigger_id)
                    res.status(200).send()
                    await sendResponseToMessage(payload.response_url, 'You selected `Create goal`. Thanks!')
                } else {
                    res.status(200).send({'text': interactiveComponent.MKTHX})
                    // if this selected we can say that the bot will contact anyway next week. Might be nice to show date and time.
                }
            }
        } else if ( payload.type === interactiveComponent.IM_TYPE_INTERACTIVE_MSG && payload.callback_id === interactiveComponent.IM_MSG_TYPE_STATUS_UPDATE) {
            if (payload.actions[0].type === interactiveComponent.IM_MENU_TYPE) {
                const goalId = payload.actions[0].selected_options[0].value
                const userId = payload.user.id
                const goal = await switchGoal(userId, goalId)
                res.status(200).send('Great! You can see the details of your current goal below. Talk soon. Good luck!')
                let data = goal
                data.callbackId = interactiveComponent.IM_MSG_TYPE_AFTER_GOAL_SWITCHED
                const attachments = formatInteractiveComponent(data)
                sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))
            } else if (payload.actions[0].type === interactiveComponent.IM_BUTTON_TYPE) {
                switch (parseInt(payload.actions[0].value)) {
                case interactiveComponent.ACTION_GOAL_COMPLETED:
                    let data = await achieveCurrentGoal(payload.user.id)
                    res.status(200).send('Awesome! Congrats! :sparkles: :tada: :cake: \nWhenever you feel ready ping me in here to plan your next step.')
                    data.callbackId = interactiveComponent.ATTCH_MSG_GOAL_COMPLETED
                    data.userId = payload.user.id
                    data.userData = await getUserData(payload.user.id, payload.team.id)
                    const attachments = formatInteractiveComponent(data)
                    await sendChannelMessage(process.env.unleash_channel, payload.team.id, null, JSON.stringify(attachments))
                    break

                case interactiveComponent.ACTION_MORE_TIME:
                    await postponeCurrentGoal(payload.user.id)
                    res.status(200).send('Ok I added another week to this. I will bug you in 7 day. Stay positive!')
                    break
                }
            }
        } else if ( payload.type === interactiveComponent.IM_TYPE_INTERACTIVE_MSG && payload.callback_id === interactiveComponent.IM_MSG_TYPE_AFTER_GOAL_CREATED) {
            if (payload.actions[0].name === interactiveComponent.ACTION_CREATE_NEW_GOAL) {
                openDialog(payload.team.id, payload.trigger_id)
                res.status(200).send()
                await sendResponseToMessage(payload.response_url, 'Opening `Create Goal` dialog ...')
            } else if (payload.actions[0].name === interactiveComponent.ACTION_SET_GOAL_IN_PROGRESS) {
                const goalId = payload.actions[0].value
                const userId = payload.user.id
                const goal = await switchGoal(userId, goalId)
                res.status(200).send('Great! You can see the details of your current goal below. Talk soon. Good luck!')
                let data = goal
                data.callbackId = interactiveComponent.IM_MSG_TYPE_AFTER_GOAL_SWITCHED
                const attachments = formatInteractiveComponent(data)
                sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))
            } else {
                res.status(200).send({'text': interactiveComponent.MKTHX})
            }
        }
    }
})

export default router
