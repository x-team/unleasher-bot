const formatGoalDueDate = (date) => {
  return date.substring(0, 10)
}

const goalsToOptions = (goals) => {
    let goalOptions = []
    goals.forEach((goal) => {
      if (!goal.achieved || goal.achieved !== true) {
        goalOptions.push({
          text: goal.name,
          value: goal.id
        })
      }
    })

    return goalOptions
}

export {
  formatGoalDueDate,
  goalsToOptions,
}
