import * as interactiveComponent from "../models/interactiveComponent"

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

const formatInteractiveComponent = (data) => {
  let component = []
  switch (data.callbackId) {
    case interactiveComponent.IM_MSG_TYPE_AFTER_GOAL_CREATED:
      component = goalCreatedTemplate(data)
      break
    case interactiveComponent.IM_MSG_TYPE_STATUS_UPDATE:
      const pretext = `Hi! What is your progress on ${data.name} lvl.${data.level} goal ?`
      component = goalCardTemplate(data, true, pretext)
      break
    case interactiveComponent.IM_MSG_TYPE_AFTER_GOAL_SWITCHED:
      component = goalCardTemplate(data, false)
      break
    case interactiveComponent.ATTCH_MSG_GOAL_COMPLETED:
      component = goalAchieved(data)
      break
  }

  return component
}

export {
    formatGoalDueDate,
    goalsToOptions,
    formatInteractiveComponent
}

const goalAchieved = (data) => {
  return [
    {
      pretext: `${data.userData.profile.real_name} has completed a goal! :sparkles:`,
      attachment_type: "default",
      color: 'good',
      fallback: 'txt',
      title: data.name || '',
      text: data.description || '',
      thumb_url: data.userData.profile.image_24
    }
  ]
}

const goalCardTemplate = (data, actions, pretext) => {
  let template = {
    pretext,
    fallback: "Unleash status update",
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id: data.callbackId,
    fields: [
      {
        title: "Name",
        value: data.name,
        short: true
      },
      {
        title: "Status",
        value: data.status,
        short: true
      },
      {
        title: "Description",
        value: data.description,
        short: true
      },
      {
        title: "Level",
        value: data.level,
        short: true
      },
      {
        title: "Due date",
        value: data.dueDate,
        short: true
      },
      {
        title: "Achieved",
        value: data.achieved ? "Yes" : "No",
        short: true
      }
    ]
  }

  if (actions) {
    template.actions = [
      {
        name: "goal_done",
        text: "Completed",
        style: "primary",
        value: 1,
        type: "button"
      },
      {
        name: "need_more_time",
        text: "I need more time",
        value: 0,
        type: "button"
      },
      {
        name: "goals_list",
        text: "Switch goal here",
        type: "select",
        options: data.dropdownOptions,
      }
    ]
  }

  return [ template ]
}

const goalCreatedTemplate = (data) => {
  return [
      {
          pretext: "Your goal has been created.",
          text: "What shal we do next ?",
          fallback: "Goal created",
          color: "#3AA3E3",
          attachment_type: "default",
          callback_id: data.callbackId,
          fields: [
              {
                  title: "Set as current",
                  value: "Use this button to set your new goal in-progress"
              },
              {
                  title: "Create another",
                  value: "Use this button to create another goal"
              },
              {
                  title: "Do nothing",
                  value: "Use this button to dismiss. I will check up on you later.",
              }
          ],
          actions: [
              {
                  name: "in_progress",
                  text: "Set as current",
                  style: "primary",
                  value: data.goalId,
                  type: "button"
              },
              {
                  name: "create_new",
                  text: "Create another",
                  value: 2,
                  type: "button"
              },
              {
                  name: "dismiss",
                  text: "Do nothing",
                  value: 0,
                  type: "button"
              }
          ]
      }
  ]
}
