import * as pathsApi from '../../pathsApi'

export const startIntroductionConvo = (response, convo) => {
  convo.say('Hi! I am Unleasher bot, if you would like to start your unleash journey DM me')
  convo.next()
}

const askDescription = (response, convo) => {
  convo.ask('How would you describe the goal in one sentence? Example: Implement a hello world application in React.js', (response, convo) => {
    convo.say('Nice one!')
    askName(response, convo)
    convo.next()
  })
}

const askName = (response, convo) => {
  const firstDay = new Date();
  const nextWeek = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);
  let goal = {
    description: response.text,
    dueDate: nextWeek.toISOString().substring(0, 10)
  }
  convo.ask('Give it a good name, maybe something like "Reactive Developer"', (response, convo) => {
    goal.name = response.text
    pathsApi.createGoal(response.user, goal).then(() => {
      convo.say('High five! I created the goal for you with a due date for next week')
      convo.next()
    })
  })
}

const askCreateGoal = (bot, response, convo) => {
  convo.ask('Hi! I can see that you have no goals yet. Would you like me to create one?', [
    {
      pattern: bot.utterances.yes,
      callback: (response, convo) => {
        askDescription(response, convo)
        convo.next()
      },
    },
    {
      pattern: bot.utterances.no,
      callback: (response, convo) => {
        goodbye(response, convo)
        convo.next()
      },
    },
    {
      default: true,
      callback: (response, convo) => {
        askAgain(response, convo, this)
        convo.next()
      },
    }
  ])
}

const askChooseGoal = (bot, response, convo, dropdownOptions) => {
  convo.ask({
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
  })
  convo.next()
}

const askAgain = (response, convo, callback) => {
  convo.say('Didn\'t get that ... Let\'s try again')
  callback(response, convo)
  convo.next()
}

const goodbye = (response, convo) => {
  convo.say('Alright, let\'s try some other time :wave:')
  convo.next()
}

export const startUnleashConvo = (bot, response, convo) => {
  pathsApi.listGoals(response.user).then((goals) => {
    let goalOptions = []
    goals.forEach((goal) => {
      goalOptions.push({
        "text": goal.name,
        "value": goal.id
      })
    })

    if (goalOptions.length) {
      askChooseGoal(bot, response, convo, goalOptions)
    } else {
      askCreateGoal(bot, response, convo)
    }

    convo.next()
  })
}
