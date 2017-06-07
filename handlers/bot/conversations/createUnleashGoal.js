import * as dateUtil from '../../../util/date'
import * as formatterUtil from '../../../util/formatter'
import { createGoal, skipGoal } from '../../../handlers/api/paths'

const addMessageAskCreateGoal = (convo, bot) => {
  convo.addQuestion('Hi! I can see that you have no goals yet. Would you like me to create one?' ,
    [
      {
        pattern: bot.utterances.yes,
        callback: (message, response) => { convo.gotoThread('createUnleashGoal_askDescription') },
      },
      {
        pattern: bot.utterances.no,
        callback: (message, response) => { convo.gotoThread('bye') },
      },
      {
        default: true,
        callback: (message, response) => { convo.repeat() },
      }
    ], {},
    'createUnleashGoal_askCreateGoal'
  )
}

const addMessageAskName = (convo, response, currentGoal) => {
  convo.addQuestion('Give it a good name, maybe something like "Reactive Developer"', [
      {
        default: true,
        callback: (message, response) => {
          convo.gotoThread('createUnleashGoal_end')
          const name = convo.extractResponse('name')
          const description = convo.extractResponse('description')
          const dueDate = formatterUtil.formatGoalDueDate(dateUtil.dateNextWeekISO())
          const level = 1
          const icon = 'home'
          const achieved = false
          const goal = { name, description, dueDate, level, icon, achieved }
          createGoal(message.user, goal)
          if (currentGoal) {
            skipGoal(message.user, currentGoal)
          }
        },
      }
    ], {
      key: 'name'
    },
    'createUnleashGoal_askGoalName'
  )
}

const addMessageGoalCreated = (convo) => {
  convo.addMessage({
      text: 'Thank you. Your goal has been created'
    },
    'createUnleashGoal_end'
  )
}

const addMessageAskDescription = (convo, bot, response) => {
  convo.addQuestion('How would you describe the goal in one sentence? Example: Implement a hello world application in React.js', [
      {
        default: true,
        callback: (message, response) => {
          convo.gotoThread('createUnleashGoal_askGoalName')
        },
      }
    ], {
      key: 'description'
    },
    'createUnleashGoal_askDescription'
  )
}

export {
  addMessageAskCreateGoal,
  addMessageAskName,
  addMessageAskDescription,
  addMessageGoalCreated,
}
