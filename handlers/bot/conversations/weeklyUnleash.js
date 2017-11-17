import { listGoals, postponeGoal } from '../../api/paths'
import { startUnleashConvo } from './startUnleash'
import { goalsToOptions } from '../../../util/formatter'

export const addMessageAskGoalCompletion = (convo, bot, goal, goals) => {
  const dropdownOptions = goalsToOptions(goals)
  // here we could check if the due date is still in the future. If so maybe button "I need more time" should just reasure that there is still time left.
  // or maybe we should change the flow on "I need more time" and in any case it's used it should as for "How much more time do you need ? "
  console.log('weeklyUnleash_askGoalCompletion', goal)
  convo.addMessage({
      "attachments": [
        {
          "pretext": `Hi! What is your progress on ${goal.name} lvl.${goal.level} goal ?`,
          "fallback": "Unleash status update",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "callback_id": "unleash_status_update",
          "fields": [
            {
              "title": "Name",
              "value": goal.name,
              "short": true
            },
            {
              "title": "Status",
              "value": goal.status,
              "short": true
            },
            {
              "title": "Description",
              "value": goal.description,
              "short": true
            },
            {
              "title": "Level",
              "value": goal.level,
              "short": true
            },
            {
              "title": "Due date",
              "value": goal.dueDate,
              "short": true
            },
            {
              "title": "Achieved",
              "value": goal.achieved ? 'Yes' : 'No',
              "short": true
            }
           ],
          "actions": [
            {
              "name": "goal_done",
              "text": "Completed",
              "style": "primary",
              "value": 1,
              "type": "button"
            },
            {
              "name": "need_more_time",
              "text": "I need more time",
              "value": 0,
              "type": "button"
            },
            {
              'name': 'goals_list',
              'text': 'Switch goal here',
              'type': 'select',
              'options': dropdownOptions,
            }
          ]
        }
      ]
    },
    'weeklyUnleash_askGoalCompletion'
  )
}

export const addMessageAskChooseGoal = (convo, bot, goals) => {
  const dropdownOptions = goalsToOptions(goals)
  convo.addMessage({
      text: 'You have no goal in progress right now. You can choose to work on one of the existing goals or create a new one.',
      response_type: 'in_channel',
      attachments: [
        {
          'fallback': 'Select or create new goal',
          'color': '#3AA3E3',
          'attachment_type': 'default',
          'callback_id': 'select_or_create_goal',
          'actions': [
            {
              'name': 'goals_list',
              'text': 'Select existing goal',
              'type': 'select',
              'options': dropdownOptions,
            },
            {
              'name': 'create_new',
              'text': 'Create Goal',
              "style": "primary",
              'value': 1,
              'type': 'button',
            },
            {
              'name': 'no',
              'text': 'Not today ...',
              'value': 0,
              'type': 'button',
            }
          ]
        }
      ]
    },
    'weeklyUnleash_askChooseGoal'
  )
}

export const addMessageAskMaybeCreateGoal = (convo, bot) => {
  convo.addQuestion(`Maybe you would like to create a new goal?`, [
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
      callback: (message, response) => {
        convo.repeat()
      },
    }
  ], {},
  'weeklyUnleash_askMaybeCreateGoal')
}
