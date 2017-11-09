import express from 'express'

import { switchGoal, createGoal } from '../handlers/api/paths'
import { formatGoalDueDate } from '../util/formatter'
import { dateNextWeekISO } from '../util/date'
import { openDialog } from '../handlers/api/slack/dialog'
import { sendResponseToMessage } from '../handlers/api/slack/chat'
import { achieveGoal, postponeGoal } from '../handlers/api/paths'

const router = new express.Router()
const IM_TYPE_DIALOG = 'dialog_submission'
const IM_TYPE_INTERACTIVE_MSG = 'interactive_message'
const IM_MSG_TYPE_CURRENT_GOAL = 'select_current_goal'
const IM_MSG_TYPE_SELECT_OR_CREATE  = 'select_or_create_goal'
const IM_MSG_TYPE_STATUS_UPDATE = 'unleash_status_update'
const DEFAULT_GOAL_LVL = 1
const DEFAULT_GOAL_ICON = 'home'
const IM_MENU_TYPE = 'select'
const IM_BUTTON_TYPE = 'button'
const MKTHX = 'Ok, thx!'
const ACTION_GOAL_COMPLETED = 1
const ACTION_MORE_TIME = 0

router.post('/im', async function (req, res) {
    if (req.body.payload) {
        const payload = JSON.parse(req.body.payload)
        if ( payload.type === IM_TYPE_DIALOG) {
            const name = payload.submission.goal_name
            const description = payload.submission.goal_description
            const dueDate = formatGoalDueDate(dateNextWeekISO())
            const level = DEFAULT_GOAL_LVL
            const icon = DEFAULT_GOAL_ICON
            const achieved = false
            const goal = { name, description, dueDate, level, icon, achieved }
            await createGoal(payload.user.id, goal)
            res.status(200).send()
        } else if ( payload.type === IM_TYPE_INTERACTIVE_MSG && payload.callback_id === IM_MSG_TYPE_CURRENT_GOAL) {
            res.status(200).send(handleSwitchGoal(payload))
        } else if ( payload.type === IM_TYPE_INTERACTIVE_MSG && payload.callback_id === IM_MSG_TYPE_SELECT_OR_CREATE) {
            if (payload.actions[0].type === IM_MENU_TYPE) {
                res.status(200).send(handleSwitchGoal(payload))
            } else if (payload.actions[0].type === IM_BUTTON_TYPE) {
                if (parseInt(payload.actions[0].value) === 1) {
                    openDialog(payload.team.id, payload.trigger_id)
                    await sendResponseToMessage(payload.response_url, MKTHX)
                    res.status(200).send()
                } else if (parseInt(payload.actions[0].value) === 0) {
                    res.status(200).send({'text': MKTHX})
                }
            }
        } else if ( payload.type === IM_TYPE_INTERACTIVE_MSG && payload.callback_id === IM_MSG_TYPE_STATUS_UPDATE) {
          console.log(payload)
          if (payload.actions[0].type === IM_MENU_TYPE) {
            res.status(200).send(handleSwitchGoal(payload))
          } else if (payload.actions[0].type === IM_BUTTON_TYPE) {
            switch (parseInt(payload.actions[0].value)) {
              case ACTION_GOAL_COMPLETED:
                achieveGoal(message.user, goal)
                break;

              case ACTION_MORE_TIME:
                postponeGoal(message.user, goal)
                break;
            }
            res.status(200).send({'text': MKTHX})
          }
        }
    }
})

export default router

const handleSwitchGoal = async (payload) => {
    const goalId = payload.actions[0].selected_options[0].value
    const userId = payload.user.id

    return (await switchGoal(userId, goalId)) ? {'text':'Goal switched'} : {'text':'Error'}
}
