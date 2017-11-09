import { achieveGoal, listGoals, postponeGoal } from '../../api/paths'
import { startUnleashConvo } from './startUnleash'

export const addMessageAskGoalCompletion = (convo, bot, goal) => {
  convo.addQuestion(`Hi! Last time we spoke you were in progress on the following goal: "${goal.name}". Have you completed it?`, [
    {
      pattern: bot.utterances.yes,
      callback: (message, response) => {
        achieveGoal(message.user, goal).then((goal) => {
          convo.say('Awesome :highfive:!')
          startUnleashConvo(bot, response, convo)
        })
      },
    },
    {
      pattern: bot.utterances.no,
      callback: (message, response) => {
        convo.gotoThread('weeklyUnleash_askMoreTime')
      },
    },
    {
      default: true,
      callback: (message, response) => {
        convo.repeat()
      },
    }
  ], {},
  'weeklyUnleash_askGoalCompletion')
}

export const addMessageAskMoreTime = (convo, bot, goal, goals) => {
  convo.addQuestion(`Do you need more time for the goal?`, [
    {
      pattern: bot.utterances.yes,
      callback: (message, response) => {
        postponeGoal(message.user, goal).then((goal) => {
          convo.say('I updated the due date for the goal to next week')
          convo.gotoThread('bye')
        })
      },
    },
    {
      pattern: bot.utterances.no,
      callback: (message, response) => {
        if (goals.length) {
          convo.gotoThread('weeklyUnleash_askChooseGoal')
        } else {
          convo.gotoThread('weeklyUnleash_askMaybeCreateGoal')
        }
      },
    },
    {
      default: true,
      callback: (message, response) => {
        convo.repeat()
      },
    }
  ], {},
  'weeklyUnleash_askMoreTime')
}

export const addMessageAskChooseGoal = (convo, bot) => {
  convo.addQuestion(`You have some unachieved goals - would you like to choose an existing one for next week?`, [
    {
      pattern: bot.utterances.yes,
      callback: (message, response) => { convo.gotoThread('startUnleash_presentGoals') },
    },
    {
      pattern: bot.utterances.no,
      callback: (message, response) => { convo.gotoThread('weeklyUnleash_askMaybeCreateGoal') },
    },
    {
      default: true,
      callback: (message, response) => {
        convo.repeat()
      },
    }
  ], {},
  'weeklyUnleash_askChooseGoal')
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
