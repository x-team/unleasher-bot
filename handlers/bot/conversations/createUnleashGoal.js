const addMessageAskCreateGoal = (convo) => {
  convo.addMessage({
      text: 'Hi! I can see that you have no goals yet. Shal we create one?',
      response_type: 'in_channel',
      attachments: [
        {
          'fallback': 'Create goal',
          'color': '#3AA3E3',
          'attachment_type': 'default',
          'callback_id': 'create_first_goal',
          'actions': [
            {
              'name': 'yes',
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
    'createUnleashGoal_askCreateGoal'
  )
}

const addMessageCreateGoalByCommand = (convo) => {
  convo.addMessage({
      text: 'Deprecated'
    },
    'createUnleashGoal_askDescription'
  )
}

export {
  addMessageAskCreateGoal,
  addMessageCreateGoalByCommand
}
