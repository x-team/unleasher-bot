export const startIntroductionConvo = (bot, err, convo) => {
  convo.say('Hi! I am Unleasher bot, if you would like to start your unleash journey DM me')
}

export const startUnleashConvo = (bot, err, convo, dropdownOptions) => {

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
            "options": dropdownOptions,
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
