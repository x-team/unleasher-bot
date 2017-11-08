const addMessageAskCreateGoal = (convo) => {
  convo.addMessage({
      text: 'Hi! I can see that you have no goals yet. You can create new goals with slash command \`/add-goal\`'
    },
    'createUnleashGoal_askCreateGoal'
  )
}

const addMessageCreateGoalByCommand = (convo) => {
  convo.addMessage({
      text: 'You can create new goals with slash command \`/add-goal\`'
    },
    'createUnleashGoal_askDescription'
  )
}

export {
  addMessageAskCreateGoal,
  addMessageCreateGoalByCommand
}
