const formatGoalDueDate = (date) => {
  return date.substring(0, 10)
}

const goalsToOptions = (goals) => {
    let goalOptions = []
    goals.forEach((goal) => {
      const data = {
        text: goal.name,
        value: goal.id
      }
      goalOptions.push(data)
    })

    return goalOptions
}

export {
  formatGoalDueDate,
  goalsToOptions,
}
