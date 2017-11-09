import express from 'express'

import { switchGoal, createGoal } from '../handlers/api/paths'
import { formatGoalDueDate } from '../util/formatter'
import { dateNextWeekISO } from '../util/date'

const router = new express.Router()
const IM_TYPE_DIALOG = 'dialog_submission'
const IM_TYPE_INTERACTIVE_MSG = 'interactive_message'
const IM_MSG_TYPE_CURRENT_GOAL = 'select_current_goal'
const DEFAULT_GOAL_LVL = 1
const DEFAULT_GOAL_ICON = 'home'

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
      const goalCreated = await createGoal(payload.user.id, goal)
      const result = (goalCreated) ? {"text":"Goal created"} : {"text":"Error"}
      res.status(201).send(result)
    } else if ( payload.type === IM_TYPE_INTERACTIVE_MSG && payload.callback_id === IM_MSG_TYPE_CURRENT_GOAL) {
      const goalId = payload.actions[0].selected_options[0].value
      const userId = payload.user.id
      const goalSwitched = await switchGoal(userId, goalId)
      const result = (goalSwitched) ? {"text":"Goal switched"} : {"text":"Error"}
      res.status(200).send(result)
    }
  }
})

export default router
