export const startUnleashConvo = (bot, err, convo) => {

  // goals in here @karol
  // also look into interactiveMessages controller for handling selection request
  const dropdownOptions = [
    {
      "text": "Path 1",
      "options": [
        {
          "text": "Goal 1",
          "value": "1"
        },
        {
          "text": "Goal 2",
          "value": "2"
        },
        {
          "text": "Goal 3",
          "value": "3"
        },
      ]
    },
    {
      "text": "Path 2",
      "options": [
        {
          "text": "Goal 1",
          "value": "4"
        },
        {
          "text": "Goal 2",
          "value": "5"
        },
      ]
    },
  ]

  convo.addMessage({
    "text": "Alright! Lets select goal you'd like to focus on this week:",
    "response_type": "in_channel",
    "attachments": [
      {
        "fallback": "Select goal",
        "color": "#3AA3E3",
        "attachment_type": "default",
        "callback_id": "id",
        "actions": [
          {
            "name": "goals_list",
            "text": "Select goal",
            "type": "select",
            "option_groups": dropdownOptions,
          },
          {
            "name":"no",
            "text": "Not today ...",
            "value": 1,
            "type": "button",
          }
        ]
      }
    ]
  },'pick_unleash_goal')

  convo.addMessage({
    text: 'Didn\'t get that ... Let\'s try again',
    action: 'default',
  },'bad_response_1')

  convo.addMessage({
    text: 'Alright, let\'s try some other time :wave:',
    action: 'end',
  },'end_unleash')

  convo.ask('Hi! Would you like to start unleashing?', [
    {
      pattern: bot.utterances.yes,
      callback: (response, convo) => {
        convo.gotoThread('pick_unleash_goal')
      },
    },
    {
      pattern: bot.utterances.no,
      callback: (response, convo) => {
        convo.gotoThread('end_unleash')
      },
    },
    {
      default: true,
      callback: (response, convo) => {
        convo.gotoThread('bad_response_1')
      },
    }
  ])

  return convo.activate()
}
