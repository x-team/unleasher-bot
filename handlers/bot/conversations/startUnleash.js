import * as dateUtil from '../../../util/date'
import { goalsToOptions } from '../../../util/formatter'
import { listGoals } from '../../api/paths'
import {
  addMessageAskCreateGoal,
  addMessageAskName,
  addMessageAskDescription,
  addMessageGoalCreated
} from './createUnleashGoal'

export const startUnleashConvo = async function(bot, response, convo) {
  const userId = response.user
  const goals = await listGoals(userId)

  addMessagePresentGoals(convo, response, goals)
  addMessageRepeat(convo)
  addMessageBye(convo)
  addMessageAskCreateGoal(convo, bot)
  addMessageAskName(convo, response)
  addMessageAskDescription(convo, bot, response)
  addMessageGoalCreated(convo)
  convo.activate()

  if (goals.length) {
    convo.gotoThread('startUnleash_presentGoals')
  } else {
    convo.gotoThread('createUnleashGoal_askCreateGoal')
  }
}

const addMessagePresentGoals = async function(convo, response, goals) {
  const dropdownOptions = goalsToOptions(goals)
  convo.addMessage({
      text: 'Alright! Lets select goal you\'d like to focus on this week:',
      response_type: 'in_channel',
      attachments: [
        {
          'fallback': 'Select goal',
          'color': '#3AA3E3',
          'attachment_type': 'default',
          'callback_id': 'id',
          'actions': [
            {
              'name': 'goals_list',
              'text': 'Select goal',
              'type': 'select',
              'options': dropdownOptions,
            },
            {
              'name': 'no',
              'text': 'Not today ...',
              'value': 1,
              'type': 'button',
            }
          ]
        }
      ]
    },
    'startUnleash_presentGoals'
  )
}

const addMessageRepeat = (convo) => {
  convo.addMessage({
      text: 'Didn\'t get that ... Let\'s try again',
      action: 'default'
    },
    'repeat'
  )
}

const addMessageBye = (convo) => {
  convo.addMessage({
      text: 'Alright, let\'s try some other time :wave:',
    },
    'bye'
  )
}
