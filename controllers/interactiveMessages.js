import express from 'express'

import { switchGoal, createGoal, achieveCurrentGoal, postponeCurrentGoal } from '../handlers/api/paths'
import { formatGoalDueDate } from '../util/formatter'
import { dateNextWeekISO } from '../util/date'
import { openDialog } from '../handlers/api/slack/dialog'
import { sendResponseToMessage, sendChatMessage } from '../handlers/api/slack/chat'

const router = new express.Router()
const IM_TYPE_DIALOG = 'dialog_submission'
const IM_TYPE_INTERACTIVE_MSG = 'interactive_message'
const IM_MSG_TYPE_CURRENT_GOAL = 'select_current_goal'
const IM_MSG_TYPE_SELECT_OR_CREATE  = 'select_or_create_goal'
const IM_MSG_TYPE_STATUS_UPDATE = 'unleash_status_update'
const IM_MSG_TYPE_CREATE_FIRST_GOAL = 'create_first_goal'
const IM_MSG_TYPE_AFTER_GOAL_CREATED = 'post_goal_created'
const DEFAULT_GOAL_LVL = 1
const DEFAULT_GOAL_ICON = 'home'
const IM_MENU_TYPE = 'select'
const IM_BUTTON_TYPE = 'button'
const MKTHX = 'Ok, thx!'
const ACTION_GOAL_COMPLETED = 1
const ACTION_MORE_TIME = 0
const ACTION_SET_GOAL_IN_PROGRESS = 'in_progress'
const ACTION_CREATE_NEW_GOAL = 'create_new'

router.post('/im', async function (req, res) {
    if (req.body.payload) {
        const payload = JSON.parse(req.body.payload)
        console.log(payload)
        if ( payload.type === IM_TYPE_DIALOG) {
            const name = payload.submission.goal_name
            const description = payload.submission.goal_description
            const dueDate = formatGoalDueDate(dateNextWeekISO())
            const level = DEFAULT_GOAL_LVL
            const icon = DEFAULT_GOAL_ICON
            const achieved = false
            const goal = { name, description, dueDate, level, icon, achieved }
            const createdGoal = await createGoal(payload.user.id, goal)
            res.status(200).send()
            const attachments = [
                {
                    'pretext': 'Your goal has been created.',
                    'text': 'What shal we do next ?',
                    'fallback': 'Goal created',
                    'color': '#3AA3E3',
                    'attachment_type': 'default',
                    'callback_id': 'post_goal_created',
                    'fields': [
                        {
                            'title': 'Set as current',
                            'value': 'Use this button to set your new goal in-progress'
                        },
                        {
                            'title': 'Create another',
                            'value': 'Use this button to create another goal'
                        },
                        {
                            'title': 'Do nothing',
                            'value': 'Use this button to dismiss. I will check up on you later.',
                        }
                    ],
                    'actions': [
                        {
                            'name': 'in_progress',
                            'text': 'Set as current',
                            'style': 'primary',
                            'value': createdGoal.id,
                            'type': 'button'
                        },
                        {
                            'name': 'create_new',
                            'text': 'Create another',
                            'value': 2,
                            'type': 'button'
                        },
                        {
                            'name': 'dismiss',
                            'text': 'Do nothing',
                            'value': 0,
                            'type': 'button'
                        }
                    ]
                }
            ]
            sendChatMessage(payload.user.id, payload.team.id, null, JSON.stringify(attachments))
            // there should be followup in here. Should this new created goal be marked in progress ?
            // also some confirmation would be nice in here - that would have to be a separate channel message
        } else if ( payload.type === IM_TYPE_INTERACTIVE_MSG && payload.callback_id === IM_MSG_TYPE_CURRENT_GOAL) {
            const goalId = payload.actions[0].selected_options[0].value
            const userId = payload.user.id
            const goal = await switchGoal(userId, goalId)
            console.log(IM_MSG_TYPE_CURRENT_GOAL, goal)
            res.status(200).send('1')
        } else if ( payload.type === IM_TYPE_INTERACTIVE_MSG && payload.callback_id === IM_MSG_TYPE_CREATE_FIRST_GOAL) {
            openDialog(payload.team.id, payload.trigger_id)
            res.status(200).send()
            await sendResponseToMessage(payload.response_url, 'You selected `Create goal`. Thanks!')
        } else if ( payload.type === IM_TYPE_INTERACTIVE_MSG && payload.callback_id === IM_MSG_TYPE_SELECT_OR_CREATE) {
            if (payload.actions[0].type === IM_MENU_TYPE) {
                const goalId = payload.actions[0].selected_options[0].value
                const userId = payload.user.id
                const goal = await switchGoal(userId, goalId)
                console.log(IM_MSG_TYPE_SELECT_OR_CREATE, goal)
                res.status(200).send(`Your goal \`${goal.name}\` is now set in progress. You have until ${goal.dueDate} to complete it.`)
                // some confirmation message in here would be in place. Maybe even bringing up the whole goal card.
            } else if (payload.actions[0].type === IM_BUTTON_TYPE) {
                if (parseInt(payload.actions[0].value) === 1) {
                    openDialog(payload.team.id, payload.trigger_id)
                    res.status(200).send()
                    await sendResponseToMessage(payload.response_url, 'You selected `Create goal`. Thanks!')
                } else {
                    res.status(200).send({'text': MKTHX})
                    // if this selected we can say that the bot will contact anyway next week. Might be nice to show date and time.
                }
            }
        } else if ( payload.type === IM_TYPE_INTERACTIVE_MSG && payload.callback_id === IM_MSG_TYPE_STATUS_UPDATE) {
            console.log(payload)
            if (payload.actions[0].type === IM_MENU_TYPE) {
                const goalId = payload.actions[0].selected_options[0].value
                const userId = payload.user.id
                const goal = await switchGoal(userId, goalId)
                console.log(IM_MSG_TYPE_STATUS_UPDATE, goal)
                res.status(200).send(`Your goal \`${goal.name}\` is now set in progress. You have until ${goal.dueDate} to complete it.`)
            // some confirmation message in here would be in place. Maybe even bringing up the whole goal card.
            } else if (payload.actions[0].type === IM_BUTTON_TYPE) {
                switch (parseInt(payload.actions[0].value)) {
                case ACTION_GOAL_COMPLETED:
                    const response = await achieveCurrentGoal(payload.user.id)
                    console.log('Achieve response:', response)
                    res.status(200).send({'text': 'TODO: Congratulate and offer options. Send notification to #unleash'})
                    // start new convo. Congratulate finishing goal and propose actions what to do next. Either create a new goal or pick from the list or skip status update for now.
                    // notification to channel should be sent
                    break

                case ACTION_MORE_TIME:
                    postponeCurrentGoal(payload.user.id)
                    res.status(200).send('Ok I added another week to this. I will bug you in 7 day. Stay positive!')
                    break
                }
            }
        } else if ( payload.type === IM_TYPE_INTERACTIVE_MSG && payload.callback_id === IM_MSG_TYPE_AFTER_GOAL_CREATED) {
            if (payload.actions[0].name === ACTION_CREATE_NEW_GOAL) {
                openDialog(payload.team.id, payload.trigger_id)
                res.status(200).send()
                await sendResponseToMessage(payload.response_url, 'Opening `Create Goal` dialog ...')
            } else if (payload.actions[0].name === ACTION_SET_GOAL_IN_PROGRESS) {
                const goalId = payload.actions[0].value
                const userId = payload.user.id
                const goal = await switchGoal(userId, goalId)
                res.status(200).send(`Your goal \`${goal.name}\` is now set in progress. You have until ${goal.dueDate} to complete it.`)
            } else {
                res.status(200).send({'text': MKTHX})
            }
        }
    }
})

export default router
